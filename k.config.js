/**
 * @file 配置
 * @author pashangshangpo
 * @createTime 2018年6月2日 上午11:55
 */

module.exports = {
  app: {
    name: 'pic'
  },
  page: {
  },
  gitCommon: [
    {
      repo: 'https://github.com/pashangshangpo/pssp-pc.git'
    },
    {
      repo: 'https://gitee.com/pashangshangpo/pssp.git'
    }
  ],
  env: {},
  inject: {
    js: [
      function () {
        const { remote } = require('electron');
        const { join } = require('path');
        const app = remote.app;
        const appPath = app.getAppPath('userData');

        window.resolveApp = function (...arr) {
          return join.apply(null, [appPath].concat(arr));
        };

        window.nativeModulePath = resolveApp('app/node_modules');

        window.Leancloud = require(join(window.nativeModulePath, 'leancloud-storage'));
      }
    ]
  }
}
