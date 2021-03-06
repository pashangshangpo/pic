/**
 * @file 设置
 * @author pashangshangpo
 * @createTime 2018年6月2日 下午3:39
 */

import React, { Component } from 'react'
import { el } from 'pssp/util'
import { Form, Input, Textarea, RadioTag } from 'pssp-pc'

export default class extends Component {
  state = {
    currentPicServer: 'github',
    customLinkFormat: ''
  }

  componentWillMount() {
    const settings = localStorage.getItem('settings')

    if (settings) {
      this.setState(JSON.parse(settings))
    }
  }

  handleClickSave = () => {
    localStorage.setItem('settings', JSON.stringify({
      currentPicServer: this.state.currentPicServer,
      customLinkFormat: this.state.customLinkFormat || '![]($url)'
    }))

    alert('设置成功')
  }

  renderSelectPicServer = () => {
    return el(
      RadioTag,
      {
        checked: this.state.currentPicServer,
        data: ['github', 'gitee', 'leancloud', 'segmentfault'],
        onChange: tag => {
          this.setState({
            currentPicServer: tag
          })
        }
      }
    )
  }

  renderCustomLinkFormat = () => {
    return el(
      Textarea,
      {
        placeholder: '![]($url)',
        minLine: 2,
        maxLine: 2,
        value: this.state.customLinkFormat,
        onChange: e => {
          this.setState({
            customLinkFormat: e.target.value
          })
        }
      }
    )
  }

  renderForm = () => {
    return el(
      Form,
      {
        data: [
          {
            name: '图床'
          },
          {
            name: '链接格式'
          }
        ]
      },
      this.renderSelectPicServer(),
      this.renderCustomLinkFormat()
    )
  }

  renderSave = () => {
    return el(
      Input,
      {
        type: 'button',
        value: '保存',
        onClick: this.handleClickSave
      }
    )
  }

  render() {
    return el(
      'div',
      {},
      this.renderForm(),
      this.renderSave()
    )
  }
}
