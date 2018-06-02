const http = require('http');
const fs = require('fs-extra');
const {join} = require('path');
const Koa = require('koa2');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const webpackMiddleware = require('koa-webpack');
const webpack = require('webpack');
const chokidar = require('chokidar');
const mockServer = require('./common/mockServer');
const {appendCss, appendJs, getIp, joinStr} = require('./util/util');
const el = require('./common/electron');
let {
  resolveApp,
	dllPath,
	dllName,
	cssPath,
	commonJsName,
	webpackDllCommonPath,
  manifestName,
  templatePath
} = require('../config/paths');
const dllEntry = require(webpackDllCommonPath).entry;

module.exports = config => {
	const {port, webpackConfig, inject = {}} = config;
	const entry = webpackConfig.entry;
	const outputPath = webpackConfig.output.path;
	const publicPath = webpackConfig.output.publicPath;

	// 引用dll包
	for (let key in dllEntry) {
		webpackConfig.plugins.push(
			new webpack.DllReferencePlugin({
        context: resolveApp('src/node_modules'),
				manifest: require(join(outputPath, dllPath, joinStr(key, '.', manifestName)))
			})
		);
	}

	// 编译webpack
	let compiler = webpack(webpackConfig);

	let middleware = webpackMiddleware({
		compiler: compiler,
		dev: {
			publicPath: publicPath,
			stats: {
				chunks: false,
				colors: true
			},
			noInfo: true,
			hot: true,
			lazy: false,
			historyApiFallback: true,
			poll: true
		}
	});

	// 获取html
	let getHTML = (path, name) => {
    // 模板内容
    if (!fs.existsSync(path)) {
      path = templatePath
    }

    let html = fs.readFileSync(path).toString();
    const injectTemp = {}

    injectTemp.css = inject.css || [];
    injectTemp.js = inject.js || [];
    injectTemp.css.push(cssPath);

    injectTemp.js = injectTemp.js.concat(
      join(dllPath, joinStr(dllEntry[name] ? name : 'common', '.', dllName)),
      joinStr(commonJsName, '.js'),
      joinStr(name, '.js')
    );

		// 向模板中注入代码
		for (let key of Object.keys(injectTemp)) {
			let section = injectTemp[key];
			if (section.length > 0) {
				if (key === 'css') {
					html = appendCss(html, section, true);
				} else if (key === 'js') {
					html = appendJs(html, section, true);
				}
			}
		}

		return html;
	};

	// 动态替换模板
	router.all('/*.html', (cxt) => {
		const name = cxt.url.slice(1).split('.')[0];
    const root = join(entry[name].slice(-1)[0], '../');

		cxt.body = getHTML(join(root, 'index.html'), name);
	});

	app.use(router.routes());
	app.use(middleware);

	// 服务
	let server = http.createServer(app.callback());

	// 转发请求
	mockServer(app, server, outputPath);

	server.listen(port, () => {
		// 开发环境
		process.env.NODE_ENV = 'dev';

		// 开启electron进程
		const newEl = () => {
			el().then(res => {
				if (res === 'start') {
					newEl();
				}
			});
		};

		newEl();
	});
};
