/**
 * @file 发布APP
 * @author pashangshangpo
 * @createTime 2018年5月13日 下午11:15
 */

const { exec } = require('child_process')
const { version } = require('../package.json')

exec(
  `zip -r version/v${version}.zip dist app images package.json`,
  () => {
    console.log('压缩APP成功')

    exec(`git add . && git commit -a -m "release v${version}" && git push && git checkout coding-pages && yarn release`, () => {
      console.log('发布成功')
    })
  }
)
