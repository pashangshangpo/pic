const { join } = require('path');
const fse = require('fs-extra');
const { postcssPath, kConfigPath, resolveApp } = require('./paths');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const util = require('../server/util/util');
const kConfig = require(kConfigPath);

// 获取入口文件路径
let entry = kConfig.entry || 'src/page';
try {
  const res = {};
  const path = resolveApp(entry);
  for (let name of fse.readdirSync(path)) {
    if (name === 'node_modules') {
      continue
    }

    res[name] = './' + join(entry, name, 'index.js')
  }

  entry = res;
}
catch (err) {
  console.error('找不到入口文件,或者手动在k.config.js中指定entry路径');
  process.exit();
}

module.exports = {
  // https://webpack.js.org/configuration/target/
  target: 'electron-renderer',
  node: {
    __filename: true,
    __dirname: true
  },
  entry: entry,
  resolve: {
    cacheWithContext: true,
    extensions: ['.js', '.css'],
    modules: [
      resolveApp('src/node_modules'),
      resolveApp('src/page/node_modules'),
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [resolveApp('node_modules'), resolveApp('src/node_modules')],
        use: ['babel-loader?cacheDirectory']
      },
      {
        test: /\.(png|jpg|gif)/,
        exclude: [resolveApp('node_modules'), resolveApp('src/node_modules')],
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name].[hash].[ext]',
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.svg/,
        exclude: [resolveApp('node_modules'), resolveApp('src/node_modules')],
        use: ['svg-sprite-loader']
      }
    ]
  },
  plugins: [
    new WebpackMd5Hash()
  ]
};

