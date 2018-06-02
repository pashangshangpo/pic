/**
 * @file 入口
 * @author pashangshangpo
 * @createTime 2018年6月2日 下午12:02
 */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { el } from 'pssp/util'
import Route from './Route'

class App extends Component {
  render() {
    return el(Route)
  }
}

ReactDOM.render(el(App), document.getElementById('app'))
