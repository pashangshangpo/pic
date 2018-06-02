/**
 * @file 上传图片
 * @author pashangshangpo
 * @createTime 2018年6月2日 下午1:41
 */

import { clipboard, ipcRenderer } from 'electron'

ipcRenderer.on('toUploadPic', () => {
  const base64 = clipboard.readImage().toDataURL().split(',')[1]
  const gitee = localStorage.getItem('gitee')

  if (gitee) {
    const { accessToken, owner, repo } = JSON.parse(gitee)

    if (base64) {
      const path = `pic-${Date.now()}-${Math.random().toString(32)}.png`

      fetch(
        `https://gitee.com/api/v5/repos/${owner}/${repo}/contents/${path}`,
        {
          method: 'POST',
          mode: 'cors',
          // 需要设置Content-Type 否则报401错误
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          body: JSON.stringify({
            access_token: accessToken,
            content: base64,
            message: `uploadpic ${path}`
          })
        }
      )
      .then(res => res.json())
      .then(res => {
        const download_url = res.content.download_url

        ipcRenderer.send('message', {
          title: 'Pic',
          body: '图片上传成功!'
        })

        clipboard.writeText(`![](${download_url})`)
      })
    }
  }
})
