/**
 * @file 程序入口
 * @author pashangshangpo
 * @createTime 2018年6月3日 上午10:18
 */

const { app, BrowserWindow, Menu, Tray } = require('electron')
const url = require('url')
const { join } = require('path')

let mainWindow
let tray = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    center: true,
    y: 60,
    show: false,
    maximizable: false,
    closable: false,
    resizable: false,
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

  app.dock.hide()

  mainWindow.once('closed', function () {
    mainWindow = null
  })
}


app.on('ready', function () {
  createWindow()

  if (!tray) {
    tray = new Tray(join(__dirname, '../images/favicon@4x.png'))
  
    tray.setToolTip('Pic')
  
    tray.on('click', () => {
      // 从command+w 将窗口显示出来
      if (mainWindow === null) {
        setTimeout(() => {
          createWindow()
        }, 100)
      }
      // command+m 从最小化关闭
      else {
        // 切换显示
        if (mainWindow.isVisible()) {
          mainWindow.minimize()
        }
        else {
          mainWindow.show()
        }
      }
    })
  
    tray.on('drop-files', (e, files) => {
      mainWindow.webContents.send('drop-files', files)
    })
  }
  
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
