/**
 * @file index page
 * @author pashangshangpo
 * @createTime 2018年6月2日 下午12:06
 */

import React, { Component } from 'react'
import { clipboard } from 'electron'
import { el } from 'pssp/util'
import { Layout } from 'pssp-pc'

import Gitee from './gitee'

const { Sider, Menu, Content } = Layout

export default class extends Component {
  state = {
    checkedName: 'gitee'
  }

  types = {
    'gitee': () => {
      return el(Gitee)
    },
    '设置': () => {
      return el(
        'div',
        {},
        '设置'
      )
    }
  }

  componentDidMount() {
    console.log(clipboard.readImage().toDataURL().split(',')[1])
  }

  renderContent = () => {
    return el(
      Content,
      {
        style: {
          padding: '12px'
        }
      },
      this.types[this.state.checkedName]()
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
          checked: this.state.checkedName,
          data: [
            {
              name: 'gitee'
            },
            {
              name: '设置'
            }
          ],
          onOpenChange: (item, data) => {
            this.setState({
              checkedName: item.name
            })
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
