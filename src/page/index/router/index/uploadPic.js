/**
 * @file 上传图片
 * @author pashangshangpo
 * @createTime 2018年6月2日 下午1:41
 */

import { clipboard, ipcRenderer } from 'electron'

const picServer = {
  gitee: (config, content, path) => {
    const { accessToken, owner, repo } = config

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
          content: content,
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

ipcRenderer.on('toUploadPic', () => {
  const base64 = clipboard.readImage().toDataURL().split(',')[1]

  if (base64) {
    const random = `${Date.now()}-${Math.random().toString(32).slice(2)}`
    const path = `pic-${random}.png`
    
    let settings = localStorage.getItem('settings')

    if (settings) {
      settings = JSON.parse(settings)
    }
    else {
      settings = {
        currentPicServer: 'gitee',
        customLinkFormat: '![]($url)'
      }
    }

    const config = localStorage.getItem(settings.currentPicServer)

    if (!config) {
      alert('没有配置Pic服务')
      return
    }

    ipcRenderer.send('message', {
      title: 'Pic',
      body: '正在上传图片...'
    })

    picServer[settings.currentPicServer](
      JSON.parse(config),
      base64,
      path
    ).then(url => {

      ipcRenderer.send('message', {
        title: 'Pic',
        body: '图片上传成功!'
      })

      clipboard.writeText(
        settings.customLinkFormat.replace('$url', url)
      )
    })
  }
})

const drag = e => {
  e.preventDefault()

  if (e.type === 'drop') {
    const files = e.dataTransfer.files
    const promiseList = []

    for (let file of files) {
      promiseList.push(new Promise(resolve => {
        const reader  = new FileReader()

        reader.addEventListener('load', () =>{
          resolve(reader.result)
        }, false)
  
        reader.readAsDataURL(file)
      }))
    }

    Promise.all(promiseList).then(results => {
      console.log(results)
    })
  }
}

document.addEventListener('dragover', drag)
document.addEventListener('drop', drag)
