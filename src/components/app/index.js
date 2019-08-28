/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:29:50
 * @LastEditTime: 2019-08-28 19:38:40
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from 'react';
import './index.css';
import localforage from 'localforage';

import WhiteBoard from './../whiteBoard/index';
import messageEngine from '../../depend/postMessage/messageEngine';
import signalEngine from '../../depend/agoraSingal/signalEngine';

import SignalData from '../../depend/agoraSingal/SignalData';
import { showToolbar, hideToolbar, showSwitchBar, reduceToolbar, childMessageBox, switchType, setTotalPage } from '../../actions';
import setZoom from '../../untils/setZoom';
import sketchpadEngine from '../../depend/sketchpadEngine/sketchpadEngine';
class App extends React.Component {
  constructor(props) {
    super(props);

    window.whiteBoardMessage = new messageEngine(this.messageCallback.bind(this));
    window.whiteBoardSignal = null;

    // 画板缓存
    window.boardCache = [];

    // 1.数据库：gzjy 2.数据仓库：whiteBoard
    window.gzjyDataBase = localforage.createInstance({
      name: "gzjy",
      driver: [localforage.INDEXEDDB,
      localforage.WEBSQL,
      localforage.LOCALSTORAGE],
      description: '白板缓存机制',
      storeName: "whiteBoard"
    });
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
    console.log("joinChannelSuccess")
    SignalData.logined = true;
    // 如果是老师 显示 画板工具栏 切页栏
    if (SignalData.role == 0) {
      gzjyDataBase.length().then((numberOfKeys) => {
        // 输出数据库的大小
        if (numberOfKeys > 0) {
          // 同样的代码，但使用 ES6 Promises
          gzjyDataBase.iterate((value, key, iterationNumber) => {
            // 此回调函数将对所有 key/value 键值对运行
            setTimeout(() => {
              SignalData.playback = true;
              this.props.dispatch(value);
            }, 100 * iterationNumber);
          }).then(() => {
            console.log('Iteration has completed');
          }).catch((err) => {
            // 当出错时，此处代码运行
            console.log(err);
          });
        } else {
          this.props.dispatch(showToolbar());
          this.props.dispatch(showSwitchBar());
        }
      }).catch((err) => {
        // 当出错时，此处代码运行
        console.log(err);
      });
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
            // 页面为重载时，不执行
            gzjyDataBase.length().then((numberOfKeys) => {
              console.log(numberOfKeys);
              if (numberOfKeys === 2) this.props.dispatch(setTotalPage({ totalPage: data.totalPage }));
            })
            break;

          default:
            this.props.dispatch(childMessageBox({ data }));
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

    // 其它用户加入频道通知
    if(typeof e !== 'string' && e.type === "onChannelUserJoined") {
      if(SignalData.role === 0){
        console.log(e.data)
        window.whiteBoardSignal.session.messageInstantSend(e.data.account,JSON.stringify(SignalData));

        setTimeout(() => {
          window.whiteBoardSignal.session.messageInstantSend(e.data.account,"哈哈哈啊哈哈上海市");
        }, 5);
      }

    }

    // 接收到 点对点 消息
    if(typeof e !== 'string' && e.type === "onMessageInstantReceive") {
      console.log("接收到 点对点 消息")
      console.log(e.data)
    }
    
    // 接收到群广播消息
    if (typeof e !== 'string' && e.type === "onMessageChannelReceive") {
      let msg = JSON.parse(e.data.msg);
      // ----------------- 
      // 描述：客户端信令广播 -- 白板执行
      // 功能：1.白板：画板工具栏 显示与隐藏   2.白板：课件显示 配置
      // ----------------- 
      if (msg.sigType) {
        // 设置是否信令广播
        SignalData.broadcast = false;

        switch (msg.sigType) {
          /*课件*/
          case 'showCourseware':
            let name = msg.sigValue.value ? "html5" : "default";
            let link = msg.sigValue.value ? msg.sigValue.link : '';
            this.props.dispatch(switchType({ name, link }));

            break;

          /*画板操作*/
          case 'showBrush':
            let uid = msg.sigUid + 'A';
            if (SignalData.account == uid && SignalData.role == '2') {
              msg.sigValue.value ? this.props.dispatch(showToolbar()) : this.props.dispatch(hideToolbar())
            }
            break;
        }
      }

      // ----------------- 
      // 描述：接受频道广播消息 -- 白板执行
      // 功能：1.画笔栏及画笔 state 2.画板 添删 
      // ----------------- 
      if (msg.action) {

        // 如果不是自己
        if (e.data.account !== SignalData.account) {
          // 设置是否信令广播
          SignalData.broadcast = false;

          // 画笔栏及画笔 执行action
          this.props.dispatch(msg.action);
          // 画板 添删 
          let action = msg.action;
          switch (action.type) {
            case "BOARD_ADD_PATH":
              canvas.addPath({ path: action.path, pathConfig: action.pathConfig })
              break;

            case "BOARD_ADD_TEXT":
              canvas.addText({ mouseFrom: action.mouseFrom, textContent: action.textContent })
              break;

            case "BOARD_ADD_GRAPH":
              canvas.addGraph({ mouseFrom: action.mouseFrom, mouseTo: action.mouseTo })
              break;

            case "BOARD_REMOVE_CREATED":
              canvas.removeCreated({ created: action.created })
              break;

            // 课件通信，声网信令传输 
            case "CHILD_MESSAGE_BOX":
              whiteBoardMessage.sendMessage("child", JSON.stringify({ type: action.data.type, handleData: action.data.handleData }));
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

              // this.props.dispatch(reduceToolbar());
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

              // this.props.dispatch(reduceToolbar());
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
            let page = parseInt(msg.action.toPage);
            if (msg.action.code == "Enter" && msg.action.totalPage + 1 > page && page > 0) {
              window.boardCache[msg.action.curPage - 1] = canvas.getObjects();
              canvas.clear();
              if (window.boardCache[page - 1]) {
                  for (let i = 0; i < window.boardCache[page - 1].length; i++) {
                      canvas.add(window.boardCache[page - 1][i])
                  }
              }
              
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
  }

  // board 画板回调监听
  boardCallback(e) {
    // 逻辑流程图  
    // 1.teacher: 画板操作 -->  action  --> 中间件(signalMessage) 信令广播(messageChannelSend) ---> teacher: --> 信令回调(signalCallback) --> break(停止逻辑) 
    //                                                            |
    //                                                            |---------> children: --> 信令回调(signalCallback) 禁止广播 --> action(state 重新渲染)
    //                                                                                                                      |
    //                                                                                                                      |--> switch(业务逻辑)
    let action = e.action;
    // 画板 图形 增删
    this.props.dispatch(action);
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
        if (!SignalData.logined && typeof data == 'object') {
          this.joinChannel(data);
          return "数据类型" + typeof data + ";客户端传输数据" + JSON.stringify(data);
        } else {
          return "数据类型" + typeof data + ";客户端传输数据 NO OBJECT" + data;
        }
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
    // let data = {
    //   agoraSignalingToken: "1:7344c75464964565a3515963ec9298ff:1568347320:049033716a4da72bb3a2bdcc0390da4c",
    //   appId: "7344c75464964565a3515963ec9298ff",
    //   role: 0,
    //   uid: 73878,
    //   channel: 476399192,
    //   canDraw: 0
    // }

    let account = Math.floor(Math.random() * 100);
    let role = Math.random() > 0.5 ? 0 : 2;
    let data = {
      role: role,
      uid: account,
      channel: 'q3',
      canDraw: true
    }

    this.joinChannel(data);
  }

  // 组件将要被卸载
  componentWillUnmount() {
    // 移除监听
    window.whiteBoardMessage.remove();

    // 信令登出
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