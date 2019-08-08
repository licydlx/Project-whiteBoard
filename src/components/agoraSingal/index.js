import React, { Component } from 'react';

import signalEngine from '../../depend/agoraSingal/signalEngine';
import signalResponse from '../../depend/agoraSingal/signalResponse';

import messageEngine from '../../depend/postMessage/messageEngine';

class agoraSingal extends React.Component {
  constructor() {
    super();

    this.message = new messageEngine((e) => {
      if (typeof e.data !== 'string' || e.data == '') return;
      let data = JSON.parse(e.data);
      // GLB.logined 是否已登录频道

    });
    this.message.listen();
  }

  componentDidMount() {
    // DOM加载完毕，web请求用户信息及登录
    this.message.sendMessage('father', 'readyForChannel', '*');

  }

  render() {
    return <div>
    </div>
  }
}


export default agoraSingal;