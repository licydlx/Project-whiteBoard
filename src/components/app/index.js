/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:29:50
 * @LastEditTime: 2019-08-23 15:58:43
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from 'react';
import './index.css';

import WhiteBoard from './../whiteBoard/index';

import messageEngine from '../../depend/postMessage/messageEngine';
import signalEngine from '../../depend/agoraSingal/signalEngine';

import SignalData from '../../depend/agoraSingal/SignalData';

import { showToolbar, showSwitchBar, reduceToolbar, childMessageBox, switchType } from '../../actions';

import setZoom from '../../untils/setZoom';

import sketchpadEngine from '../../depend/sketchpadEngine/sketchpadEngine';
class App extends React.Component {
  constructor(props) {
    super(props);

    window.whiteBoardMessage = new messageEngine(this.messageCallback.bind(this));
    window.whiteBoardSignal = null;
    // 画板缓存
    window.boardCache = [];
  }

  // ====================
  // 客户端 post 通知课件 创建账号并加入频道
  // ====================
  joinChannel(data) {
    signalEngine(data, this.signalCallback.bind(this), this.joinChannelSuccess.bind(this))
  }

  // ====================
  // 加入声网频道成功
  // ====================
  joinChannelSuccess() {
    // 如果是老师 显示 画板工具栏 切页栏
    if (SignalData.role == 0) {
      this.props.dispatch(showToolbar());
      this.props.dispatch(showSwitchBar());
    }
  }

  // ====================
  // postMessage 回调监听
  // ====================
  messageCallback(e) {
    if (e.data && typeof e.data == "string") {
      let data = JSON.parse(e.data);
      // 加入频道通知
      if (data.uid && data.channel) this.joinChannel(data);

      // 课件message
      if (data.type) {
        switch (data.type) {
          case "SWITCHBOX_SET_TOTAL_PAGE":
            this.props.dispatch(data);
            break;

          default:
            this.props.dispatch(childMessageBox(data));
            break;
        }
      }
    }
  }

  // ====================
  // signal 回调监听
  // ====================
  signalCallback(e) {
    if (!e) return;
    // ----------------- 
    // 描述：客户端信令广播 -- 白板执行
    // 功能：1.白板：画板工具栏 显示与隐藏   2.白板：课件显示 配置
    // ----------------- 
    if (typeof e == 'string') {
      let data = JSON.parse(e);
      if (data.sigType) {
        switch (data.sigType) {
          /*课件*/
          case 'showCourseware':
            let name = data.sigValue.value ? "html5" : "default";
            let link = data.sigValue.value ? data.sigValue.link : '';
            this.props.dispatch(switchType(name, link));

            break;

          /*画板操作*/
          case 'showBrush':
            // let uid = data.sigUid + 'A';
            // if (GLB.account == uid && GLB.role == '2') {
            //   let brushCopy = JSON.stringify(this.state.brush);
            //   let newBrush = JSON.parse(brushCopy);
            //   newBrush.show = data.sigValue.value ? true : false;
            //   this.setState({
            //     brush: newBrush
            //   })
            // }
            break;

        }
      }
    }

    // ----------------- 
    // 描述：接受频道广播消息 -- 白板执行
    // 功能：1.画笔栏及画笔 state 2.画板 添删 
    // ----------------- 
    if (typeof e !== 'string' && e.type === "onMessageChannelReceive") {
      let msg = JSON.parse(e.data.msg);

      // 如果不是自己
      if (e.data.account !== SignalData.account) {
        // 设置是否信令广播
        SignalData.broadcast = false;

        // 画笔栏及画笔 执行action
        this.props.dispatch(msg.action);
        // 画板 添删 
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

          case "CHILD_MESSAGE_BOX":
            whiteBoardMessage.sendMessage("child", JSON.stringify({ type: msg.action.data.type, handleData: msg.action.data.handleData }));
            break;
          default:
            break;
        }
      }

      // switchBar 页面跳转
      switch (msg.action.type) {
        case "SWITCHBOX_GO_PREVPAGE":
          if (msg.action.page > 1) {
            window.boardCache[msg.action.page - 1] = canvas.getObjects();
            canvas.clear();

            this.props.dispatch(reduceToolbar());

            let page = msg.action.page - 1;
            if (window.boardCache[page - 1]) {
              for (let i = 0; i < window.boardCache[page - 1].length; i++) {
                canvas.add(window.boardCache[page - 1][i])
              }
            }

            whiteBoardMessage.sendMessage("child", JSON.stringify({ type: msg.action.type, handleData: { page: page } }));
          }
          break;

        case "SWITCHBOX_GO_NEXTPAGE":
          if (msg.action.page < msg.action.totalPage) {
            window.boardCache[msg.action.page - 1] = canvas.getObjects();
            canvas.clear();

            this.props.dispatch(reduceToolbar());
            let page = msg.action.page + 1;
            if (window.boardCache[page - 1]) {
              for (let i = 0; i < window.boardCache[page - 1].length; i++) {
                canvas.add(window.boardCache[page - 1][i])
              }
            }
            whiteBoardMessage.sendMessage("child", JSON.stringify({ type: msg.action.type, handleData: { page: page } }));
          }
          break;

        case "SWITCHBOX_GO_HANDLE_KEYDOWN":
          let page = parseInt(msg.action.page);
          if (msg.action.totalPage >= page && page > 0) {
            whiteBoardMessage.sendMessage("child", JSON.stringify({ type: msg.action.type, handleData: { page: page } }));
          }
          break;
        case "SWITCHBOX_FULL_SCREEN":
          let data = msg.action.fullScreen ? 'miniWhiteboard' : 'maxWhiteboard';
          if (window !== window.parent) window.parent.postMessage(data, '*');
          if (window.webkit) window.webkit.messageHandlers[data].postMessage(data);
          break;
        default:
          break;
      }

    }
  }

  // board 画板回调监听
  boardCallback(e) {
    // 逻辑流程图  
    // 1.teacher: 画板操作 -->  action  --> 中间件(signalMessage) 信令广播(messageChannelSend) ---> teacher: --> 信令回调(signalCallback) --> break(停止逻辑) 
    //                                                            |
    //                                                            |---------> children: --> 信令回调(signalCallback) 禁止广播 --> action(state 重新渲染)
    //                                                                                                                      |
    //                                                                                                                      |--> switch(业务逻辑)

    // 画板 图形 增删
    this.props.dispatch(e.action);
  }

  // 组件完成挂载
  componentDidMount() {

    // ====================
    // 描述：画板
    // 功能：1.实例化 画板 2.动态配置尺寸
    // ====================
    sketchpadEngine('sketchpadBoard', this.boardCallback.bind(this));
    setZoom(window.canvas);

    // ====================
    // 描述：创建账号，加入信令频道 请求
    // 功能：1.DOM加载完毕 - 发送请求消息 （客户端，ipad）
    // ====================
    if (window.webkit) {
      window.receiveResourceInfoFun = function (data) {
        if (!SignalData.logined && typeof data == 'string') this.joinChannel(JSON.parse(data));
      }.bind(this);
      window.webkit.messageHandlers.readyForChannel.postMessage('readyForChannel');
    } else {
      if (!SignalData.logined) whiteBoardMessage.sendMessage('father', 'readyForChannel', '*');
    }

    // ====================
    // 默认账号登录 （供本地测试用）
    // 以老师进入默认频道
    // ====================

 
    // let account = Math.floor(Math.random() * 100);
     let data = {
      agoraSignalingToken :"1:7344c75464964565a3515963ec9298ff:1568347320:049033716a4da72bb3a2bdcc0390da4c",
       appId :"7344c75464964565a3515963ec9298ff",
       role: 0,
       uid: 73878,
       channel: 476399192,
       canDraw: 0
     }
     this.joinChannel(data);
  }

  // 组件将要被卸载
  componentWillUnmount() {
    // 移除监听
    window.whiteBoardMessage.remove();
    // 信令登出
    // window.whiteBoardSignal
    // 页面刷新或关闭提示
    window.onbeforeunload = function (event) {
      window.whiteBoardSignal.channel.channelLeave();
    }.bind(this);
  }

  render() {
    return <div className="container">
      <WhiteBoard />
    </div>
  }
}

export default App;