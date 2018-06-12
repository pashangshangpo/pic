/**
 * @file leancloud
 * @author pashangshangpo
 * @createTime 2018年6月12日 下午12:35:51
 */

import React, { Component } from 'react'
import { el } from 'pssp/util'
import { Form, Input } from 'pssp-pc'

export default class extends Component {
  state = {
    appId: '',
    appKey: ''
  }

  componentWillMount() {
    const data = localStorage.getItem('leancloud')

    if (data) {
      this.setState(JSON.parse(data))
    }
  }

  handleClickSave = () => {
    const {
      appId,
      appKey
    } = this.state

    localStorage.setItem('leancloud', JSON.stringify({
      appId,
      appKey
    }))

    alert('设置成功')
  }

  renderAppId = () => {
    return el(
      Input,
      {
        type: 'text',
        placeholder: '请输入appId',
        value: this.state.appId,
        onChange: e => {
          this.setState({
            appId: e.target.value
          })
        }
      }
    )
  }

  renderAppKey = () => {
    return el(
      Input,
      {
        type: 'text',
        placeholder: '请输入appKey',
        value: this.state.appKey,
        onChange: e => {
          this.setState({
            appKey: e.target.value
          })
        }
      }
    )
  }

  renderForm = () => {
    return el(
      Form,
      {
        ref: ref => this.form = ref,
        messageDirection: 'bottom',
        data: [
          {
            name: 'appId',
            type: 'inputText',
            rule: {
              require: true,
              requireMessage: '请输入appId'
            }
          },
          {
            name: 'appKey',
            type: 'inputText',
            rule: {
              require: true,
              requireMessage: '请输入appKey'
            }
          }
        ]
      },
      this.renderAppId(),
      this.renderAppKey()
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
