/**
 * @file segmentfault
 * @author pashangshangpo
 * @date 2018-11-14 21:51:06
 */

import React, { Component } from 'react'
import { el } from 'pssp/util'
import { Form, Input } from 'pssp-pc'

export default class extends Component {
  state = {
    cookie: ''
  }

  componentWillMount() {
    const data = localStorage.getItem('segmentfault')

    if (data) {
      this.setState(JSON.parse(data))
    }
  }

  handleClickSave = () => {
    const {
      cookie
    } = this.state

    localStorage.setItem('segmentfault', JSON.stringify({
      cookie
    }))

    alert('设置成功')
  }

  renderCookie = () => {
    return el(
      Input,
      {
        type: 'text',
        placeholder: '请输入cookie',
        value: this.state.cookie,
        onChange: e => {
          this.setState({
            cookie: e.target.value
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
            name: 'cookie',
            type: 'inputText',
            rule: {
              require: true,
              requireMessage: '请输入cookie'
            }
          }
        ]
      },
      this.renderCookie()
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
