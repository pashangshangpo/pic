const urlTo = require('url');
const http = require('http');
const https = require('https');
const mime = require('mime');
const fse = require('fs-extra');
const querystring = require('querystring');
const multiparty = require('multiparty');
const Router = require('koa-router');
const router = new Router();
const Mock = require('mockjs');
const {apiPath, resolveApp} = require('../../config/paths');
const {each, joinStr} = require('../util/util');

module.exports = (app, server, staticPath) => {
	const io = require('socket.io')(server);

	// 监听socket请求
	let socket = null;
	io.on('connection', function(skt) {
		socket = skt;
		socket.on('clearData', () => {
			results.clear();
		});
	});

	// emitData
	let emitData = () => {
		if (socket) {
			socket.emit('data', results.data);
		}
	};

	// 收集信息
	let results = {
		data: [],
		add: ({req, reqBody, resBody, from = 'local'} = data) => {
			results.data.push({
				from,
				method: req.method,
				url: req.url,
				query: querystring.parse(urlTo.parse(req.url).query),
				reqBody: reqBody,
				resBody: resBody
			});

			emitData();
		},
		clear: () => {
			results.data.length = 0;
		}
	};

	// 获取请求响应数据
	let getData = async re => {
		return new Promise(resolve => {
			if (re.headers['content-type'] && re.headers['content-type'].indexOf('multipart/form-data') !== -1) {
				let form = new multiparty.Form();
				form.parse(re, (err, fields, files) => {
					resolve(Object.assign(
						{},
						fields,
						files
					));
				});
			} else {
				let type = re.headers['content-type'];
				let isTo = !type || type.indexOf('json') !== -1 || type.indexOf('text') !== -1 || type.indexOf('xml') !== -1;
				let data = [];

				re.on('data', chunk => data.push(chunk));
				re.on('end', () => {
					resolve(isTo ? Buffer.concat(data).toString() : Buffer.concat(data));
				});
			}
		});
	};

	// 转发请求
	let requestServer = async(url, req, cxt) => {
		return new Promise(resolve => {
			let urlParse = urlTo.parse(url);
      let head = req.headers;
			// let temp = {
			// 	'Cookie': apiConfig.cookie || req.headers.cookie || ''
			// };

			// if (head['content-length']) {
			// 	temp['content-length'] = head['content-length'];
			// }

			// if (head['content-type']) {
			// 	temp['content-type'] = head['content-type'];
      // }
      head.Cookie = apiConfig.cookie || req.headers.cookie || '';
			let protocol = urlParse.protocol && urlParse.protocol.split(':')[0];
			let type = protocol === 'https' ? https : http;

			let serverReq = type.request(
				{
					hostname: urlParse.hostname,
					port: urlParse.port,
					path: urlParse.path,
					method: req.method,
					headers: head
				},
				(result, req) => {
					// 处理服务器返回的cookie
					const cookies = result.headers['set-cookie'] || [];
					cookies.forEach(cookie => {
						const arr = cookie.split(';');
						const option = {};
						const temp = {};
						arr.forEach((item, index) => {
							const val = item.split('=');
							if (index === 0) {
								temp.key = val[0];
								temp.value = val[1];
							}
							else {
								option[val[0]] = val[1];
							}
						});

						cxt.cookies.set(temp.key, temp.value, option);
					});

					getData(result).then(data => {
						try {
							data = JSON.parse(data);
						} catch (err) {
						}
						resolve(data);
					});
				}
			);

			req.pipe(serverReq);
		});
	};

	// 打开调式页面
	router.get('/debug', cxt => {
		cxt.set('Content-Type', 'text/html');
		cxt.body = fse.readFileSync(resolveApp('server', 'debug.html'));
	});

	const api = require(apiPath);
	const apiConfig = api.config;
	const apiRequest = api.request;

	if (typeof apiConfig.cookie === 'object') {
		(async() => {
			apiConfig.cookie = await require('../util/getCookie')(apiConfig.cookie);
		})();
	}

	// 数据返回之后先进行其他处理再返回
	const resThen = async() => {
		const delay = apiConfig.delay;

		if (delay) {
			await new Promise(resolve => {
				setTimeout(() => {
					resolve();
				}, delay);
			});
		}
	};

	// 请求本地数据
	const requestLocal = api => {
		// 遍历request规则
		each(api, (val, key) => {
			// 提取method,url
			let arr = key.split(' ');
			let method = arr[0];
			let url = arr[1];
			if (!url) {
				url = method;
				method = 'all';
			}

			method = method.toLowerCase();

			if (typeof val === 'function') {
				router[method](url, async cxt => {
					// 暴露一些常用方法给用户
					cxt.query = querystring.parse(urlTo.parse(cxt.url).query);
					cxt.Mock = Mock;
					cxt.mock = Mock.mock;
					cxt.Random = Mock.Random;

					await getData(cxt.req).then(res => {
						cxt.reqBody = res;
					});

					// 等待用户配置的返回,防止用户在函数中使用了异步的操作
					const res = await val(cxt);

					await resThen();

					cxt.body = res;
					results.add({
						req: cxt.req,
						reqBody: cxt.reqBody,
						resBody: cxt.body
					});
				});
			} else if (typeof val === 'object') {
				router[method](url, async cxt => {
					await getData(cxt.req).then(res => {
						cxt.reqBody = res;
					});

					await resThen();

					cxt.body = val;
					results.add({
						req: cxt.req,
						reqBody: cxt.reqBody,
						resBody: cxt.body
					});
				});
			}
			// 转发到服务器
			else if (typeof val === 'string') {
				router[method](url, async cxt => {
					getData(cxt.req).then(res => {
						cxt.reqBody = res;
					});

					await requestServer(val, cxt.req).then(async res => {
						await resThen();

						cxt.body = res;
						results.add({
							req: cxt.req,
							reqBody: cxt.reqBody,
							resBody: cxt.body
						});
					});
				});
			}
		});
	};

	// 如果开启拦截或未设置则请求本地数据
	if (apiConfig.open !== false || !apiConfig.server) {
		requestLocal(apiRequest);
	}

	/**
   * 如果开启了拦截则先跑用户写的规则,
   * 如果规则不存在则尝试当成是获取本地文件,
   * 如果本地文件也不存在则到服务器中获取
   */
	router.all('*', async cxt => {
		let url = cxt.url;
		let path = '';

		if (url === '/' || url === '') {
			path = '/index.html';
		} else {
			path = url;
		}

		path = resolveApp(staticPath, urlTo.parse(path).pathname);

		if (!fse.existsSync(path)) {
			url = joinStr(apiConfig.server, url);

			getData(cxt.req).then(res => {
				cxt.reqBody = res;
			});

			// 没有填写server服务器
			if (url === '/favicon.ico') {
				cxt.body = {
					status: 'ok'
				};
			}
			else {
				await requestServer(url, cxt.req, cxt).then(async res => {
					await resThen();
	
					cxt.body = res;
					results.add({
						req: cxt.req,
						reqBody: cxt.reqBody,
						resBody: cxt.body,
						from: 'server'
					});
				});
			}
		} else {
			let type = 'text/plain';
			try {
				type = mime.lookup(path);
			} catch (err) {}

			// 低版本ie浏览器不认识application/javascript, 会当成文件来下载
			if (type === 'application/javascript') {
				type = 'text/plain';
			}

			cxt.set('Content-type', type);
			cxt.body = fse.readFileSync(path);
		}
	});

	app.use(router.routes());
};
