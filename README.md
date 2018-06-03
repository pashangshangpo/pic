# 介绍

图床

## 使用教程

### 设置图床服务

![](https://raw.githubusercontent.com/pic-123/pic/pic/pic-1528012228288-464j203imo.png)

默认使用github, 自定义链接格式默认为`![]($url)`, 其中$url代表当前文件或图片地址, 修改完后点击保存

点击保存后, 根据设置的图床服务, 到相关页面填写配置信息

### github图床设置

根据表单填写相关信息, token到github中的设置页获取

![](https://raw.githubusercontent.com/pic-123/pic/pic/pic-1528012441704-jj6gco0bd4g.png)

### gitee图床设置

1. 到 https://gitee.com 上注册一个账号

2. 创建一个项目

3. 到 https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoStargazers 获取授权

4. 设置配置信息

填写完点击保存

### 上传图片

上传图片有三种方式

- 用拖拽的方式将文件放入到程序界面
- 用拖拽的方式将文件放入到Pic托盘图标上
- 屏幕剪贴, 然后按command + shift + p

上传成功后, 桌面右上角会有相应提醒, 并且会自动复制图片链接, 按command + v粘贴即可

## 相关问题

- 支持哪些系统

  目前仅支持MAC系统

- 更换电脑或重装系统, 配置信息还在吗?

  需要重新设置, 因为使用的是本地储存
