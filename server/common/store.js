/**
 * 共享状态
 */
const nedb = require('nedb-a')
const { join } = require('path')
const { storePath } = require('../../config/paths')

const db = new nedb({
  filename: storePath,
  autoload: true
})

module.exports = {
  // 发送消息
  async send(data) {
    return await new Promise(resolve => {
      db.insert(data, async (err, doc) => {
        if (err) {
          resolve()
        }
        else {
          resolve(doc)
        }
      })
    })
  },
  // log
  async log(title, log) {
    return await new Promise(resolve => {
      db.insert({
        title,
        log
      }, async (err, doc) => {
        if (err) {
          resolve()
        }
        else {
          resolve(doc)
        }
      })
    })
  },
  // 获取消息
  async get(query = {}, filter = {}) {
    return await new Promise(resolve => {
      db.find(query, filter, async (err, doc) => {
        if (err) {
          resolve([])
        }
        else {
          resolve(doc)
        }
      })
    })
  },
  // 删除消息
  async remove(query = {}, options = { multi: true }) {
    return await new Promise(resolve => {
      db.remove(query, options, async (err, doc) => {
        if (err) {
          resolve()
        }
        else {
          resolve('ok')
        }
      })
    })
  }
}
