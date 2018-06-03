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
    accessToken: '',
    owner: '',
    repo: '',
    branch: 'master'
  }

  componentWillMount() {
    const gitee = localStorage.getItem('gitee')
    
    if (gitee) {
      this.setState(JSON.parse(gitee))
    }
  }

  handleClickSave = () => {
    if (this.state.accessToken !== '' && this.state.owner !== '' && this.state.repo !== '') {
      localStorage.setItem('gitee', JSON.stringify(this.state))
      alert('设置成功')
    }
  }

  renderAccessToken = () => {
    return el(
      Input,
      {
        type: 'text',
        placeholder: '请输入Token',
        value: this.state.accessToken,
        onChange: e => {
          this.setState({
            accessToken: e.target.value
          })
        }
      }
    )
  }

  renderOwner = () => {
    return el(
      Input,
      {
        type: 'text',
        placeholder: '请输入用户名',
        value: this.state.owner,
        onChange: e => {
          this.setState({
            owner: e.target.value
          })
        }
      }
    )
  }

  renderRepo = () => {
    return el(
      Input,
      {
        type: 'text',
        placeholder: '请输入仓库名',
        value: this.state.repo,
        onChange: e => {
          this.setState({
            repo: e.target.value
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
      this.renderOwner(),
      this.renderRepo(),
      this.renderBranch(),
      this.renderAccessToken()
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
