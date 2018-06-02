const fse = require('fs-extra');
const { join } = require('path');
const { appendCss, appendJs, joinStr } = require('./util/util');
const webpack = require('webpack');
const minify = require('html-minifier').minify;
const {
	resolveApp,
	templatePath,
	dllPath,
	indexMap,
	dllName,
	dllMap,
	manifestName
} = require('../config/paths');

module.exports = ({ webpackConfig, inject = {}, func = (() => { }), debug = false } = config) => {
	const entry = webpackConfig.entry;
	const outputPath = webpackConfig.output.path;

	const indexMapDest = join(outputPath, indexMap);
	const dllMapDest = join(outputPath, dllMap);
	const dllMapConfig = require(dllMapDest);

	if (debug) {
		webpackConfig.devtool = 'eval-source-map';
	}

	inject.css = inject.css || [];
	inject.js = inject.js || [];

	// 引用dll包
	for (let key in dllMapConfig) {
		let name = dllMapConfig[key].js;

		webpackConfig.plugins.push(
			new webpack.DllReferencePlugin({
				context: resolveApp('src/node_modules'),
				manifest: require(join(outputPath, dllPath, joinStr(name.slice(0, name.indexOf(dllName) - 1), '.', manifestName)))
			})
		);
	}

	// 构建
	const compiler = webpack(webpackConfig);

	const injectHTML = () => {
    const indexMapConfig = require(indexMapDest);

		// 替换模板
		for (let key in entry) {
			const injectTemp = {
				js: [...inject.js],
				css: [...inject.css]
			};

			injectTemp.js.push(join(dllPath, dllMapConfig[dllMapConfig[key] ? key : 'common'].js));
			injectTemp.js.push(indexMapConfig.common.js);

			indexMapConfig[key] && indexMapConfig[key].css
				? injectTemp.css.push(indexMapConfig[key].css)
				: '';

			indexMapConfig[key] && indexMapConfig[key].js
				? injectTemp.js.push(joinStr(indexMapConfig[key].js))
				: injectTemp.js.push(joinStr(indexMapConfig.common.js));

      // 模板内容
      let pageTemplatePath = join(entry[key].split('/').slice(0, -1).join('/'), key + '.html')

      if (!fse.existsSync(pageTemplatePath)) {
        pageTemplatePath = templatePath;
      }

      let html = fse.readFileSync(pageTemplatePath).toString();      

			// 向模板中注入代码
			for (let key of Object.keys(injectTemp)) {
				let section = injectTemp[key];
				if (section.length > 0) {
					// 不能使用绝对路径
					if (key === 'css') {
						html = appendCss(html, section.map(path => path.replace ? path.replace('/', '') : path));
					} else if (key === 'js') {
						html = appendJs(html, section.map(path => path.replace ? path.replace('/', '') : path));
					}
				}
			}

			fse.writeFileSync(resolveApp(outputPath, `${key}.html`), minify(html, {
				collapseBooleanAttributes: true,
				collapseInlineTagWhitespace: true,
				collapseWhitespace: true,
				minifyCSS: true,
				minifyJS: true,
				minifyURLs: true,
				removeAttributeQuotes: true,
				removeComments: true,
				removeScriptTypeAttributes: true
			}));
		}

		console.log('构建完成');

		func();
		fse.removeSync(indexMapDest);
		fse.removeSync(dllMapDest);
	};

	compiler.run((err, status) => {
		if (err) {
			console.log(err);
		} else {
			injectHTML();
		}
	});
};
