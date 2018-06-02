/**
 * @file index page
 * @author pashangshangpo
 * @createTime 2018年6月2日 下午12:06
 */

import React, { Component } from 'react'
import { el } from 'pssp/util'
import { Layout } from 'pssp-pc'

const { Sider, Menu, Content } = Layout

export default class extends Component {
  renderContent = () => {
    return el(
      Content,
      {
        style: {
          padding: '12px'
        }
      },
      '我是内容内容'
    )
  }

  renderSider = () => {
    return el(
      Sider,
      {},
      el(
        Menu,
        {
          mode: 'vertical',
          checked: 'gitee',
          data: [
            {
              name: 'gitee'
            },
            {
              name: '设置'
            }
          ],
          onClick: (item, section, data) => {
          },
          onOpenChange: (item, data) => {
          }
        }
      )
    )
  }

  render() {
    return el(
      Layout,
      {
        style: {
          backgroundColor: '#fff'
        }
      },
      this.renderSider(),
      this.renderContent()
    )
  }
}
