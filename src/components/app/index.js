/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:29:50
 * @LastEditTime: 2019-09-05 19:16:03
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from 'react';
import './index.css';
import localforage from 'localforage';

import WhiteBoard from './../whiteBoard/index';
import messageEngine from '../../depend/postMessage/messageEngine';
import signalEngine from '../../depend/agoraSingal/signalEngine';

import SignalData from '../../depend/agoraSingal/SignalData';
import { showToolbar, hideToolbar, showSwitchBar, childMessageBox, switchType, setTotalPage } from '../../actions';
import setZoom from '../../untils/setZoom';
import isBrowser from '../../untils/isBrowser';

import sketchpadEngine from '../../depend/sketchpadEngine/sketchpadEngine';


class App extends React.Component {
  constructor(props) {
    super(props);
    window.whiteBoardMessage = new messageEngine(this.messageCallback.bind(this));
    window.whiteBoardSignal = null;
    window.coursewareCurPage = 1;
  }

  createInstance(data) {
    // 页面state缓存 
    // 1.switchBox state  2.sketchpad state

    // 画板缓存
    // sketchpad board data

    // 回放 actions 缓存
    // actions
    for (let i = 0; i < data.length; i++) {
      window[data[i].storeName + "_database"] = localforage.createInstance({
        name: "gzjy",
        driver: [localforage.INDEXEDDB,
        localforage.WEBSQL,
        localforage.LOCALSTORAGE],
        description: data[i].description,
        storeName: data[i].storeName + "-" + SignalData.account + SignalData.channel
      });
    }
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
    SignalData.logined = true;
    // 如果是老师 显示 画板工具栏 切页栏
    this.createInstance([{ storeName: "PAGE", description: "页面state缓存" }, { storeName: "BOARD", description: "画板缓存" }, { storeName: "ACTIONS", description: "actions缓存" }]);

    if (SignalData.role === 0) {
      // 初始化本地数据库
      this.props.dispatch(showToolbar());
      this.props.dispatch(showSwitchBar());

      ACTIONS_database.length().then((numberOfKeys) => {
        if (numberOfKeys > 0) {
          ACTIONS_database.key(0).then(keyName => {
            ACTIONS_database.getItem(keyName).then(keyValue => {
              this.props.dispatch(keyValue);
            })
          })
        }
      })
    }
  }

  // ====================
  // postMessage 回调监听
  // ====================
  messageCallback(e) {
    if (e.data && typeof e.data == "string") {
      let data = JSON.parse(e.data);
      // 加入频道通知
      if (data.uid && data.channel && !SignalData.logined) this.joinChannel(data);

      // 课件message
      if (data.type) {
        switch (data.type) {
          case "SWITCHBOX_SET_TOTAL_PAGE":
            this.props.dispatch(setTotalPage({ totalPage: data.totalPage }));
            break;

          case "COURSEWARE_ONLOAD":
            // 课件加载完成，有缓存，就跳到最近的
            PAGE_database.length().then((numberOfKeys) => {
              if (numberOfKeys > 0) {
                PAGE_database.key(numberOfKeys - 1).then(keyName => {
                  PAGE_database.getItem(keyName).then(keyValue => {

                    SignalData.playback = true;
                    this.props.dispatch(keyValue);

                    BOARD_database.iterate(v => {
                      if (v.curPage == keyValue.curPage) {
                        SignalData.playback = true;
                        this.props.dispatch(Object.assign({}, v, { account: "" }));
                      }
                    }).then((data) => { })

                  })
                })
              }
            }).catch((err) => {
              console.log(err);
            });

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
    if (typeof e !== 'string' && e.type === "onChannelUserJoined") {
      // 学生中途进入频道，老师同步缓存信令
      if (SignalData.role === 0) {

        ACTIONS_database.length().then((numberOfKeys) => {
          if (numberOfKeys > 0) {
            ACTIONS_database.key(0).then(keyName => {
              ACTIONS_database.getItem(keyName).then(keyValue => {
                window.whiteBoardSignal.session.messageInstantSend(e.data.account, JSON.stringify({ type: "SYCN_COURSEWARE_LINK", data: keyValue }));

                // PAGE_database.length().then((numberOfKeys) => {
                //   if (numberOfKeys > 0) {
                //     PAGE_database.key(numberOfKeys - 1).then(keyName => {
                //       PAGE_database.getItem(keyName).then(keyValue => {
                //         window.whiteBoardSignal.session.messageInstantSend(e.data.account, JSON.stringify({ type: "SYCN_COURSEWARE_PAGE", data: keyValue }));
                //         let boards = [];
                //         BOARD_database.iterate(v => {
                //           if (v.curPage == coursewareCurPage) boards.push(v);
                //         }).then(() => {
                //           console.log(boards)
                //         })
                //       })
                //     })
                //   }
                // })

              })
            })
          }
        }).catch((err) => {
          console.log(err);
        });

      }
    }

    // 接收到 点对点 消息
    if (typeof e !== 'string' && e.type === "onMessageInstantReceive") {
      console.log("接收到 点对点 消息")
      let msg = JSON.parse(e.data.msg);

      //  为学生时才执行
      if (SignalData.role == 2) {
        if (window.webkit) {
          window.webkit.messageHandlers.WebLog.postMessage('接收到 点对点 消息');
          window.webkit.messageHandlers.WebLog.postMessage(e.data.msg);
        }

        switch (msg.type) {
          case "SYCN_COURSEWARE_LINK":
            this.props.dispatch(msg.data);
            break;

          case "SYCN_COURSEWARE_PAGE":
            // console.log(msg.data);
            // this.props.dispatch(msg.data);
            break;
          default:
            break;
        }
      }
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
            if (link && link == SignalData.coursewareLink) return;
            if (link) SignalData.coursewareLink = link;
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
          switch (msg.action.type) {
            case "CHILD_MESSAGE_BOX":
              whiteBoardMessage.sendMessage("child", JSON.stringify({ type: msg.action.data.type, handleData: msg.action.data.handleData }));
              break;
            default:
              break;
          }
        }
      }
    }
  }

  // board 画板回调监听
  boardCallback(e) {
    // 画板 图形 增删
    this.props.dispatch(Object.assign({}, { account: SignalData.account, curPage: coursewareCurPage }, e.action));
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

    // let ran;
    // if (isBrowser() == "Chrome") {
    //   ran = 0;
    // } else {
    //   ran = 2;
    // }

    // let data = {
    //   role: ran,
    //   uid: ran + "1",
    //   channel: 'q7',
    //   canDraw: true
    // }

    // console.log(data)
    // this.joinChannel(data);
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

  // showDefault() {
  //   window.whiteBoardSignal.channel.messageChannelSend(JSON.stringify({
  //     sigType: "showCourseware",
  //     sigValue: {
  //       value: false,
  //       link: ""
  //     },
  //   }));
  // }

  // showHtml5() {
  //   window.whiteBoardSignal.channel.messageChannelSend(JSON.stringify({
  //     sigType: "showCourseware",
  //     sigValue: {
  //       value: true,
  //       link: "https://www.kunqu.tech/test/"
  //     },
  //   }));
  // }

  render() {
    return <div className="container">
      <WhiteBoard />
      {/* <div style={{ position: "absolute", top: "100px", left: "100px", width: "50px", height: "30px", zIndex: 10 }} onClick={() => this.showDefault()}>默认白板</div>
      <div style={{ position: "absolute", top: "200px", left: "100px", width: "50px", height: "30px", zIndex: 10 }} onClick={() => this.showHtml5()}>HTML5课件</div> */}
    </div>
  }
}

export default App;