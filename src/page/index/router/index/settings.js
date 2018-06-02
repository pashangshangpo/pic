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
    
  }

  componentWillMount() {
    
  }

  handleClickSave = () => {
    
  }

  handleChangeSelectPicServer = () => {
    
  }

  renderSelectPicServer = () => {
    return el(
      'div',
      {},
      el(
        'h4',
        {},
        '当前使用的图床'
      ),
      el(
        RadioTag,
        {
          checked: 'gitee',
          data: ['gitee'],
          onChange: this.handleChangeSelectPicServer
        }
      )
    )
  }

  renderCustomLinkFormat = () => {
    return el(
      'div',
      {},
      el(
        'h4',
        {},
        '自定义链接格式'
      ),
      el(
        Textarea,
        {
          placeholder: '$url为图片地址, markdown图片格式为: ![]($url)',
          minLine: 3
        }
      )
    )
  }

  renderForm = () => {
    return el(
      'div',
      {},
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
