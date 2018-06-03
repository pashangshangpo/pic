/**
 * @file 上传图片
 * @author pashangshangpo
 * @createTime 2018年6月2日 下午1:41
 */

import { clipboard, ipcRenderer } from 'electron'
import fs from 'fs'

const picServer = {
  gitee: (config, content, path) => {
    const { accessToken, owner, repo } = config

    return fetch(
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
        return res.content.download_url
      })
  }
}

const uploadPic = base64 => {
  const arr = base64.split(',')
  const content = arr[1]

  if (content) {
    const random = `${Date.now()}-${Math.random().toString(32).slice(2)}`
    const ext = arr[0].split(':')[1].split(';')[0].split('/')[1]
    const path = `pic-${random}.${ext}`
    
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

    return picServer[settings.currentPicServer](
      JSON.parse(config),
      content,
      path
    )
    .then(url => {
      return settings.customLinkFormat.replace('$url', url)
    })
  }

  return Promise.resolve()
}

const uploadPicSuccess = () => {
  ipcRenderer.send('message', {
    title: 'Pic',
    body: '图片上传成功!'
  })
}

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
      return Promise.all(results.map(base64 => {
        return uploadPic(base64)
      }))
    })
    .then(urls => {
      clipboard.writeText(urls.join('\n'))
      uploadPicSuccess()
    })
  }
}

document.addEventListener('dragover', drag)
document.addEventListener('drop', drag)

ipcRenderer.on('toUploadPic', () => {
  uploadPic(
    clipboard.readImage().toDataURL()
  )
  .then(url => {
    if (url) {
      clipboard.writeText(url)
      uploadPicSuccess()
    }
  })
})

ipcRenderer.on('drop-files', (e, paths) => {
  const promiseList = []

  for (let path of paths) {
    promiseList.push(
      new Promise(resolve => {
        fs.readFile(path, (err, data) => {
          if (err) {
            console.log(err)
          }
    
          resolve(data.toString('base64'))
        })
      })
    )
  }

  Promise.all(promiseList).then(files => {
    files = files.filter(file => file !== '')
    console.log(files)
  })
})
