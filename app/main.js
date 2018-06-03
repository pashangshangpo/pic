/**
 * @file 程序入口
 * @author pashangshangpo
 * @createTime 2018年6月3日 上午10:18
 */

const { app, BrowserWindow, Menu } = require('electron')
const url = require('url')
const { join } = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 380,
    height: 290,
    center: true,
    y: 60,
    show: false,
    fullscreenable: true,
    /**
     * webSecurity Boolean (可选) - 当设置为 false, 它将禁用同源策略 (通常用来测试网站), 如果此选项不是由开发者设置的，还会把 allowRunningInsecureContent设置为 true. 默认值为 true。
       allowRunningInsecureContent Boolean (可选) -允许一个 https 页面运行 http url 里的资源，包括 JavaScript, CSS 或 plugins. 默认值为 false.
     */
    webSecurity: false,
    allowRunningInsecureContent: true
  })

  process.$mainWindow = mainWindow
  require('./event')

  // 根据环境来执行
  if (process.env.NODE_ENV === 'dev') {
    mainWindow.loadURL(url.format({
      pathname: '127.0.0.1:8087/index.html',
      protocol: 'http:',
      slashes: true
    }))

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
  }
  else {
    mainWindow.loadURL(url.format({
      pathname: join(__dirname, '../dist/dest/index.html'),
      protocol: 'file:',
      slashes: true
    }))
    // mainWindow.webContents.openDevTools()
  }

  // 准备完成时再显示,友好体验
  mainWindow.once('ready-to-show', function () {
    setTimeout(function () {
      mainWindow.show()
    }, 100)
  })

  mainWindow.once('closed', function () {
    mainWindow = null
  })
}


app.on('ready', function () {
  createWindow()

  require('./tray')
  require('./menu')
  require('./keydown')
})

// 退出
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 创建
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
  else {
    mainWindow.show()
  }
})
