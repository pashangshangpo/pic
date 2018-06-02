/**
 * @file 全局键盘事件
 * @author pashangshangpo
 * @createTime 2018年5月5日 下午1:19
 */

const { app, globalShortcut } = require('electron')
const mainWindow = process.$mainWindow

globalShortcut.register('command+shift+p', function () {
  mainWindow.webContents.send('toUploadPic')
})

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})
