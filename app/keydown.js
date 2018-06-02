/**
 * @file 全局键盘事件
 * @author pashangshangpo
 * @createTime 2018年5月5日 下午1:19
 */

const { app, globalShortcut } = require('electron')
const mainWindow = process.$mainWindow

globalShortcut.register('command+;', function () {
  if (!mainWindow.isVisible()) {
    mainWindow.show()
  }
})

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})
