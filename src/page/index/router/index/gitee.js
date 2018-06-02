/**
 * @file gitee
 * @author pashangshangpo
 * @createTime 2018年6月2日 下午12:40
 */

import React, { Component } from 'react'
import { el } from 'pssp/util'
import { Form, Input } from 'pssp-pc'

export default class extends Component {
  renderAccessToken = () => {
    return el(
      Input,
      {
        type: 'text',
        placeholder: '请输入access_token',
        onChange: e => {
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
        onChange: e => {
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
        onChange: e => {
        }
      }
    )
  }

  renderSave = () => {
    return el(
      Input,
      {
        type: 'button',
        value: '保存'
      }
    )
  }

  render() {
    return el(
      'div',
      {},
      el(
        Form,
        {
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
      ),
      this.renderSave()
    )
  }
}
