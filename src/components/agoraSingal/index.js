/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 17:23:39
 * @LastEditTime: 2019-08-20 10:37:57
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from 'react';

import signalEngine from '../../depend/agoraSingal/signalEngine';
import signalResponse from '../../depend/agoraSingal/signalResponse';

import messageEngine from '../../depend/postMessage/messageEngine';


class agoraSingal extends React.Component {
  constructor() {
    super();

    // window.whiteBoardPost = new messageEngine((e) => {
    //   if (typeof e.data !== 'string' || e.data == '') return;
    //   let data = JSON.parse(e.data);
    //   // GLB.logined 是否已登录频道

    // });

    // window.whiteBoardPost.listen();
  }

  // // 新用户注册，加入频道
  // loginChannel(data) {
  //   console.log('loginChannel');
  //   signalEngine(data, (engine) => {
  //     // 接入声网信令sdk对应的回调 
  //     signalResponse(engine, listenSignalMessage.bind(this));

  //     this.engine = engine;

  //     // 老师角色为0
  //     if (GLB.role == 0) {
  //       let newBrush = Object.assign({}, this.state.brush, { show: GLB.canDraw });
  //       let newSwitchPage = this.state.switchPage;
  //       newSwitchPage.show = true;

  //       let date = new Date();
  //       let today = date.getDate();
  //       let name = GLB.role + '-' + GLB.channel + '-' + today;
  //       let curPage = 'page' + this.state.switchPage.currentPage;
  //       // 配置不同的驱动优先级
  //       this.localforage.config({
  //         driver: [this.localforage.INDEXEDDB,
  //         this.localforage.WEBSQL,
  //         this.localforage.LOCALSTORAGE],
  //         name: name,
  //         description: '白板缓存机制'
  //       });

  //       this.setState({
  //         brush: newBrush,
  //         switchPage: newSwitchPage
  //       }, () => {
  //         this.setPageCacheValue(curPage);
  //       });
  //     }
  //   });
  // }

  componentDidMount() {
    // DOM加载完毕，web请求用户信息及登录
    window.whiteBoardPost.sendMessage('father', 'readyForChannel', '*');
  }

  componentWillUnmount() {
    // 移除监听
    window.whiteBoardPost.remove();
  }

  render() {
    return <div>
    </div>
  }
}


export default agoraSingal;