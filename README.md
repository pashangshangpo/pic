# 介绍

图床

## 使用教程

### 设置图床服务

![](https://gitee.com/photo-storage/pic/raw/master/pic-1527939710945-15qqt6hpoh8.png)

默认使用gitee, 自定义链接格式默认为![]($url), 其中$url代表当前文件或图片地址, 修改完后点击保存

点击保存后, 根据设置的图床服务, 到相关页面填写配置信息

### 码云图床设置

1. 到 https://gitee.com 上注册一个账号

2. 创建一个项目

3. 到 https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoStargazers 获取授权

4. 设置配置信息

![](https://gitee.com/photo-storage/pic/raw/master/pic-1527940433588-bubm1qk0qlg.png)

```
access_token: 用户授权码
owner: 项目所属个性地址路径
repo: 项目路径
```

填写完点击保存

### 上传图片

上传图片有两种方式

- 用拖拽的方式将文件放入到程序界面
- 屏幕剪贴, 然后按command + shift + p

## 相关问题

- 支持哪些系统
  目前仅支持MAC系统

- 支持哪些图床
  暂只支持码云图床

- 更换电脑或重装系统, 配置信息还在吗?
  需要重新设置, 因为使用的是本地储存
