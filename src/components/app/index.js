/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:29:50
 * @LastEditTime: 2019-08-21 17:28:06
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from 'react';
import './index.css';

import WhiteBoard from './../whiteBoard/index';

import messageEngine from '../../depend/postMessage/messageEngine';
import signalEngine from '../../depend/agoraSingal/signalEngine';

import SignalData from '../../depend/agoraSingal/SignalData';
// import signalCallback from '../depend/agoraSingal/signalCallback';
import sketchpadEngine from '../../depend/sketchpadEngine/sketchpadEngine';
class App extends React.Component {
  constructor(props) {
    super(props);
    // 配置
    this.config = {
      width: 960,
      height: 540, //默认画板高、宽
    };

    window.whiteBoardMessage = new messageEngine(this.messageCallback);
    window.whiteBoardSignal = null;
  }

  // postMessage 回调监听
  messageCallback(e) {
    if (typeof e.data !== 'string' || e.data == '') return;
    let data = JSON.parse(e.data);
  }

  // signal 回调监听
  signalCallback(e) {

    if (e.type === "onMessageChannelReceive") {
      let msg = JSON.parse(e.data.msg);
      console.log(msg);
      if (e.data.account !== SignalData.account) {
        // 设置是否信令广播
        SignalData.broadcast = false;
        // 执行action
        this.props.dispatch(msg.action);
        
        switch (msg.action.type) {
          case "BOARD_ADD_PATH":
            canvas.addPath(msg.action.path, msg.action.pathConfig)
            break;

          case "BOARD_ADD_TEXT":
            canvas.addText(msg.action.mouseFrom, msg.action.textContent)
            break;

          case "BOARD_ADD_GRAPH":
            canvas.addGraph(msg.action.mouseFrom, msg.action.mouseTo)
            break;

          case "BOARD_REMOVE_CREATED":
            canvas.removeCreated(msg.action.created)
            break;

          default:
            break;
        }
      }
    }

    // if(e.type == "BOARD_ADD_PATH") {

    // }


  }

  // board 回调监听
  boardCallback(e) {
    // 执行action
    this.props.dispatch(e.action);
  }

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

    signalEngine(data, this.signalCallback.bind(this));

    sketchpadEngine('sketchpadBoard', this.boardCallback.bind(this));

    this.setZoom(window.canvas);
  }

  // 组件将要被卸载
  componentWillUnmount() {
    // 移除监听
    window.whiteBoardMessage.remove();
    // 信令登出
    // window.whiteBoardSignal
  }

  //设置缩放
  setZoom(canvas) {
    // 任务
    // 对可视区，元素高宽等做些研究，归纳
    // 2019-08-14
    let zoom = 1;
    let whiteBoard = document.getElementById("whiteBoard");
    let eleWidth = whiteBoard.offsetWidth,
      eleHeight = whiteBoard.offsetHeight,
      cHeight = canvas.height,
      cWidth = canvas.width;
    let width = eleWidth > cWidth ? eleWidth : cWidth;
    let height = eleHeight > cHeight ? eleHeight : cHeight;
    if (width > height) {
      // 横版
      width = eleWidth;
      height = eleHeight;
      zoom = width / this.config.width;
    } else {
      // 竖版
      height = height * eleHeight / this.config.height * 0.8;
      zoom = height / this.config.height;
    }
    canvas.setZoom(zoom);
    canvas.setWidth(width);
    canvas.setHeight(height);
    window.zoom = zoom;
    canvas.renderAll();
  }

  render() {
    return <div className="container">
      <WhiteBoard />
    </div>
  }
}

export default App;