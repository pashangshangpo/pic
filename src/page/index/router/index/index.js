/**
 * @file index page
 * @author pashangshangpo
 * @createTime 2018年6月2日 下午12:06
 */

import React, { Component } from 'react'
import { el } from 'pssp/util'
import { Layout } from 'pssp-pc'

import Settings from './settings'

import Github from './github'
import Gitee from './gitee'
import Leancloud from './leancloud'

import './uploadPic'
import './index.less'

const { Sider, Menu, Content } = Layout

export default class extends Component {
  state = {
    checkedName: 'github'
  }

  types = {
    'github': () => {
      return el(Github)
    },
    'gitee': () => {
      return el(Gitee)
    },
    'leancloud': () => {
      return el(Leancloud)
    },
    '设置': () => {
      return el(Settings)
    }
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
      {
        style: {
          minWidth: '85px'
        }
      },
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
              name: 'github'
            },
            {
              name: 'leancloud'
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
