/**
 * @file 上传图片
 * @author pashangshangpo
 * @createTime 2018年6月2日 下午1:41
 */

import { clipboard, ipcRenderer } from 'electron'
import { extname, join } from 'path'
import fs from 'fs'

let initState = false

const getPathName = (ext = '') => {
  let random = `${Date.now()}-${Math.random().toString(32).slice(2)}`

  if (ext) {
    ext = `.${ext}`
  }

  return `pic-${random}${ext}`
}

const picServer = {
  gitee: (config, content, path) => {
    const { token, userName, warehouse, branch } = config

    return fetch(
      `https://gitee.com/api/v5/repos/${userName}/${warehouse}/contents/${path}`,
      {
        method: 'POST',
        mode: 'cors',
        // 需要设置Content-Type 否则报401错误
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
          access_token: token,
          content: content,
          message: 'upload pic',
          branch: branch
        })
      }
    )
      .then(res => res.json())
      .then(res => {
        return res.content.download_url
      })
  },
  github: (config, content, path) => {
    return fetch(
      `https://api.github.com/repos/${config.userName}/${config.warehouse}/contents/${encodeURI(path)}`,
      {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Authorization': `token ${config.token}`,
          'Content-Type': 'application/json;charset=UTF-8',
          'User-Agent': 'pic'
        },
        body: JSON.stringify({
          path: path,
          message: 'upload pic',
          content: content,
          branch: config.branch
        })
      }
    )
    .then(res => res.json())
    .then(res => {
      return res.content.download_url
    })
  },
  leancloud: (config, content, path) => {
    if (!initState) {
      Leancloud.init(
        config.appId,
        config.appKey
      )

      initState = true
    }
    
    return new Leancloud.File(path, {
      base64: content
    })
    .save()
    .then(file => {
      return file.url()
    })
  }
}

const parseBase64 = base64 => {
  const arr = base64.split(',')
  const content = arr[1]

  if (!content) {
    return {
      content: '',
      ext: ''
    }
  }

  return {
    content: content,
    ext: arr[0].split(':')[1].split(';')[0].split('/')[1]
  }
}

const uploadPic = (content, ext) => {
  if (content) {
    const path = getPathName(ext)

    let settings = localStorage.getItem('settings')

    if (settings) {
      settings = JSON.parse(settings)
    }
    else {
      settings = {
        currentPicServer: 'github',
        customLinkFormat: '![]($url)'
      }
    }

    const config = localStorage.getItem(settings.currentPicServer)

    if (!config) {
      alert('没有配置pic服务')
      return
    }

    ipcRenderer.send('message', {
      title: 'pic',
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
    title: 'pic',
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
        const reader = new FileReader()

        reader.addEventListener('load', () => {
          resolve(reader.result)
        }, false)

        reader.readAsDataURL(file)
      }))
    }

    Promise.all(promiseList).then(results => {
      return Promise.all(results.map(base64 => {
        const { content, ext } = parseBase64(base64)

        return uploadPic(content, ext)
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
  let { content, ext } = parseBase64(clipboard.readImage().toDataURL())

  uploadPic(content, ext)
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

          resolve({
            content: data.toString('base64'),
            ext: extname(path).slice(1)
          })
        })
      })
    )
  }

  Promise.all(promiseList).then(files => {
    files = files.filter(file => file.content !== '')
    
    return Promise.all(files.map(file => {
      return uploadPic(file.content, file.ext)
    }))
    .then(urls => {
      clipboard.writeText(urls.join('\n'))
      uploadPicSuccess()
    })
  })
})
