/**
 * @file 系统托盘
 * @author pashangshangpo
 * @createTime 2018年6月3日 上午10:13
 */

const { join } = require('path')
const { Tray } = require('electron')

const mainWindow = process.$mainWindow
let tray = null

// 右上角显示
if (!tray) {
  tray = new Tray(join(__dirname, '../images/favicon@4x.png'))
  tray.setToolTip('Pic')
  tray.on('click', function () {
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
}
