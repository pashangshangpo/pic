/**
 * dll common
 */
const {resolveApp, kConfigPath} = require('./paths')
const packageJson = require(resolveApp('src', 'package.json'))
const {page} = require(kConfigPath)

// 如果k.config.js中单独设置了dll配置,则走用户配置,否则走默认的
let entry = {}
let all = Object.keys(packageJson.dependencies)
let keys = Object.keys(page)

for(let key of keys) {
  const dll = page[key].dll
  
  if (dll !== false) {
    entry[key] = dll ? dll : all
  }
}

entry.common = all;

module.exports = {
	entry,
  target: 'electron-renderer',
	resolve: {
		cacheWithContext: true,
		extensions: ['.js', '.css'],
		modules: [
      resolveApp('src/node_modules'),
      resolveApp('src/page/node_modules'),
      'node_modules'
    ]
	}
}
