/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:29:50
 * @LastEditTime: 2019-08-20 16:44:38
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from 'react';
import './App.css';

import WhiteBoard from './whiteBoard/index';

import messageEngine from '../depend/postMessage/messageEngine';
import signalEngine from '../depend/agoraSingal/signalEngine';

import signalCallback from '../depend/agoraSingal/signalCallback';

class App extends React.Component {
  constructor() {
    super();

    window.whiteBoardMessage = new messageEngine(this.messageCallback);
    window.whiteBoardSignal = null;
  }

  // postMessage 回调监听
  messageCallback(e) {
    if (typeof e.data !== 'string' || e.data == '') return;
    let data = JSON.parse(e.data);
  }

  // // signal 回调监听
  // signalCallback(e) {
  //   console.log(e);
  // }

  // 组件完成挂载
  componentDidMount() {
    // DOM加载完毕，web请求用户信息及登录
    // window.whiteBoardMessage.sendMessage('father', 'readyForChannel', '*');
    // console.log(signalCallback);

    //
    // 默认账号登录
    // 
    let account = Math.floor(Math.random() * 100);
    let data = {
        role: 0,
        uid: account,
        channel: 'q2',
        canDraw: true
    }
    
    signalEngine(data, signalCallback);
  }

  // 组件将要被卸载
  componentWillUnmount() {
    // 移除监听
    window.whiteBoardMessage.remove();
    // 信令登出
    // window.whiteBoardSignal
  }

  render() {
    return <div className="container">
      <WhiteBoard />
    </div>
  }
}

export default App;