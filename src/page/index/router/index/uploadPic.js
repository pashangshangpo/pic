/**
 * @file 上传图片
 * @author pashangshangpo
 * @createTime 2018年6月2日 下午1:41
 */

import { clipboard, ipcRenderer } from 'electron'

ipcRenderer.on('toUploadPic', () => {
  console.log(clipboard.readImage().toDataURL().split(',')[1])
})
