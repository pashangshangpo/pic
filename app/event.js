/**
 * @file 渲染进程所有事件监听
 * @author pashangshangpo
 * @createTime 2018年5月14日 下午11:18
 */

const { app, ipcMain, dialog, BrowserWindow, Notification } = require('electron')
const { join } = require('path')
const mainWindow = process.$mainWindow
let win

// 显示窗口
ipcMain.on('show-window', function (event) {
  mainWindow.show()
})

// dialog
ipcMain.on('dialog-message', function (event, arg, cb = () => { }) {
  // 不允许同时有多个弹窗
  if (!win) {
    // 创建一个新窗口主要是为了可以使alert获得焦点
    win = new BrowserWindow({
      width: 900,
      frame: false,
      transparent: true,
      show: false
    })

    win.show()

    dialog.showMessageBox(win, arg, function (e) {
      cb(e)
      win.hide()
      win.close()
      win = null
    })
  }
})

// 通知
ipcMain.on('message', function (event, arg) {
  const notification = new Notification({
    title: arg.title,
    subtitle: arg.subtitle,
    body: arg.body,
    icon: join(__dirname, '../images/favicon@4x.png'),
    sound: arg.sound || 'Glass',
    hasReply: !!arg.reply,
    replyPlaceholder: arg.reply
  })

  notification.once('reply', function (e, reply) {
    mainWindow.webContents.send('message-reply', reply)
  })

  notification.once('click', function (e) {
    mainWindow.webContents.send('message-click', e)
  })

  notification.show()
})

// 重启
ipcMain.on('restart', function () {
  app.relaunch({
    args: process.argv.slice(1)
  })

  app.exit(0)
})
