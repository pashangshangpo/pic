/**
 * @file gitee
 * @author pashangshangpo
 * @createTime 2018年6月2日 下午12:40
 */

import React, { Component } from 'react'
import { el } from 'pssp/util'
import { Form, Input } from 'pssp-pc'

import './gitee.less'

export default class extends Component {
  state = {
    userName: '',
    warehouse: '',
    token: '',
    branch: 'master'
  }

  componentWillMount() {
    const gitee = localStorage.getItem('gitee')
    
    if (gitee) {
      this.setState(JSON.parse(gitee))
    }
  }

  handleClickSave = () => {
    localStorage.setItem('gitee', JSON.stringify(this.state))
    alert('设置成功')
  }

  renderUserName = () => {
    return el(
      Input,
      {
        type: 'text',
        placeholder: '请输入用户名',
        value: this.state.userName,
        onChange: e => {
          this.setState({
            userName: e.target.value
          })
        }
      }
    )
  }

  renderWarehouse = () => {
    return el(
      Input,
      {
        type: 'text',
        placeholder: '请输入仓库名',
        value: this.state.warehouse,
        onChange: e => {
          this.setState({
            warehouse: e.target.value
          })
        }
      }
    )
  }

  renderBranch = () => {
    return el(
      Input,
      {
        type: 'text',
        placeholder: '请输入分支名',
        value: this.state.branch,
        onChange: e => {
          this.setState({
            branch: e.target.value
          })
        }
      }
    )
  }

  renderToken = () => {
    return el(
      Input,
      {
        type: 'text',
        placeholder: '请输入Token',
        value: this.state.token,
        onChange: e => {
          this.setState({
            token: e.target.value
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
            name: '用户名',
            type: 'inputText',
            rule: {
              require: true,
              requireMessage: '请输入用户名'
            }
          },
          {
            name: '仓库名',
            type: 'inputText',
            rule: {
              require: true,
              requireMessage: '请输入仓库名'
            }
          },
          {
            name: '分支名',
            type: 'inputText',
            rule: {
              require: true,
              requireMessage: '请输入分支名'
            }
          },
          {
            name: 'Token',
            type: 'inputText',
            rule: {
              require: true,
              requireMessage: '请输入Token'
            }
          }
        ]
      },
      this.renderUserName(),
      this.renderWarehouse(),
      this.renderBranch(),
      this.renderToken()
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
