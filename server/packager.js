/**
 * @file 打包APP
 * @author pashangshangpo
 * @createTime 2018年5月12日 上午9:28:40
 */

const packager = require('electron-packager')
const { exec } = require('child_process')
const { resolveApp, kConfigPath } = require('../config/paths')
const { app } = require(kConfigPath)

// 打包配置
let config = Object.assign(
  {
    dir: '',
    icon: 'images/favicon.icns',
    out: 'outapp',
    ignore: (dir) => {
      // https://github.com/electron-userland/electron-packager/issues/380
      if (dir === '') {
        return false
      }
      // 需要忽略的
      const ignore = [
        '/api',
        '/db',
        '/src',
        '/config',
        '/dev',
        '/outapp',
        '/server',
        '/temp',
        '/version',

        '/.babelrc',
        '/.editorconfig',
        '/.eslintrc',
        '/.vscode',
        '/.gitignore',
        '/.git',
        '/yarn.lock',
        '/ecosystem.config.js',
        '/k.config.js',
        '/package-lock.json',
        '/README.md',

        '/node_modules',
        '/app/node_modules/.bin',
        '/app/node_modules/electron*'
      ]

      for (let item of ignore) {
        if (dir.match(new RegExp('^' + item))) {
          return true
        }
      }

      return false
    },
    name: 'electron-template',
    platform: 'darwin',
    arch: 'all',
    appVersion: '0.0.1',
    prune: true,
    overwrite: true,
    asar: false
  },
  app
)

// 换成绝对路径
config.dir = resolveApp(config.dir)
config.icon = resolveApp(config.icon)
config.out = resolveApp(config.out)

exec(
  `rm -rf ${config.out}`,
  () => {
    packager(config)
    .then(() => {
      console.log('打包完成')
    })
    .catch(err => {
      console.log(err)
    })
  }
)
