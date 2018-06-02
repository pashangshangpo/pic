/**
 * @file gitee
 * @author pashangshangpo
 * @createTime 2018年6月2日 下午12:40
 */

import React, { Component } from 'react'
import { el } from 'pssp/util'
import { Form, Input } from 'pssp-pc'

export default class extends Component {
  state = {
    accessToken: '',
    owner: '',
    repo: ''
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
        placeholder: '请输入access_token',
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
        placeholder: '请输入owner',
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
        placeholder: '请输入repo',
        value: this.state.repo,
        onChange: e => {
          this.setState({
            repo: e.target.value
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
            name: 'access_token',
            type: 'inputText',
            rule: {
              require: true,
              requireMessage: '请输入access_token'
            }
          },
          {
            name: 'owner',
            type: 'inputText',
            rule: {
              require: true,
              requireMessage: '请输入owner'
            }
          },
          {
            name: 'repo',
            type: 'inputText',
            rule: {
              require: true,
              requireMessage: '请输入repo'
            }
          }
        ]
      },
      this.renderAccessToken(),
      this.renderOwner(),
      this.renderRepo()
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
