/**
 * @file 路由
 * @author pashangshangpo
 * @createTime 2018年6月2日 上午11:54
 */

import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import Index from './router/index'

export default class extends Component {
  render() {
    return (
      <HashRouter>
        <div id="router">
          <Route path="/" component={Index} />
        </div>
      </HashRouter>
    );
  }
}
