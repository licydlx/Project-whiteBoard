/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:29:50
 * @LastEditTime: 2019-09-23 18:04:38
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import './index.css';
import localforage from 'localforage';
// eslint-disable-next-line no-unused-vars
import fabric from 'fabric';
// eslint-disable-next-line no-unused-vars
import WhiteBoard from './../whiteBoard/index';
import messageEngine from '../../depend/postMessage/messageEngine';
import signalEngine from '../../depend/agoraSingal/signalEngine';

import SignalData from '../../depend/agoraSingal/SignalData';
import { showToolbar, hideToolbar, showSwitchBar, childMessageBox, switchType, setTotalPage, changeBoardZindex } from '../../actions';
import setZoom from '../../untils/setZoom';
// eslint-disable-next-line no-unused-vars
import isBrowser from '../../untils/isBrowser';

import { clientMessageADP } from '../../untils/adapter';
import sketchpadEngine from '../../depend/sketchpadEngine/sketchpadEngine';
import vConsole from 'vconsole';

class App extends React.Component {
  constructor(props) {
    super(props);
    window.whiteBoardMessage = new messageEngine(this.messageCallback.bind(this));
    window.whiteBoardSignal = null;
    window.coursewareCurPage = 1;

    new vConsole();

    this.sigValue = false;
    this.loading = false;
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
        storeName: data[i].storeName + "-" + SignalData.account
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
    // 初始化本地数据库
    this.createInstance([{ storeName: "PAGE", description: "页面state缓存" }, { storeName: "BOARD", description: "画板缓存" }, { storeName: "ACTIONS", description: "actions缓存" }]);

    // 如果是老师 显示 画板工具栏 切页栏
    if (SignalData.role === 0) {
      this.props.dispatch(showToolbar());
      this.props.dispatch(showSwitchBar());
    }

    window.ACTIONS_database.length().then((numberOfKeys) => {
      if (numberOfKeys > 0) {
        window.ACTIONS_database.key(0).then(keyName => {
          window.ACTIONS_database.getItem(keyName).then(keyValue => {
            // 大于2个小时，清空缓存
            // 浏览器表现不一致，容错处理 
            // 1.手机火狐 获取缓存值 有问题
            let curTime = parseInt((+new Date()).toString().slice(-11));
            let cacheTime = parseInt(keyName.slice(-11));

            const gap = Math.ceil((curTime - cacheTime) / (1000 * 60));
            if (gap > 120) {
              window.ACTIONS_database.clear();
              window.BOARD_database.clear();
              window.PAGE_database.clear();
              console.log('清空超过当前频道2小时的数据缓存！');
            } else {
              if (SignalData.role === 0) {
                SignalData.playback = true;
                this.props.dispatch(keyValue);
              }
            }

          })
        })
      }
    });

  }

  // ====================
  // postMessage 回调监听
  // ====================
  messageCallback(e) {
    if (e.data && typeof e.data == "string") {
      let data = JSON.parse(e.data);
      // 加入频道通知
      if (data.uid && data.channel && !SignalData.logined) {
        SignalData.logined = true;
        this.joinChannel(data);
      }

      // 课件message
      if (data.type) {
        switch (data.type) {
          case "SWITCHBOX_SET_TOTAL_PAGE":
            this.props.dispatch(setTotalPage({ totalPage: data.totalPage }));
            break;

          case "COURSEWARE_ONLOAD":
            this.coursewareOnload();

            break;
          default:
            this.props.dispatch(childMessageBox({ data }));
            break;
        }
      }
    }
  }

  coursewareOnload() {
    // 课件加载完成，有缓存，就跳到最近的
    window.PAGE_database.length().then((numberOfKeys) => {
      if (numberOfKeys > 0) {
        window.PAGE_database.key(numberOfKeys - 1).then(keyName => {
          window.PAGE_database.getItem(keyName).then(keyValue => {

            if (keyValue.curPage == 1) {
              SignalData.playback = true;
              this.props.dispatch(changeBoardZindex({ zIndex: 0 }));

              window.BOARD_database.iterate(v => {
                if (v.curPage == keyValue.curPage) {
                  SignalData.playback = true;
                  this.props.dispatch(Object.assign({}, v, { account: "" }));
                }
              }).then(() => {
                SignalData.playback = true;
                this.props.dispatch(changeBoardZindex({ zIndex: 3 }));
                console.log("回放完成！")
              })
            }

            // 针对 pdf 做的异步 跳页
            let d = setTimeout(() => {
              SignalData.playback = true;
              this.props.dispatch(keyValue);
              clearTimeout(d);
            }, 800);
          })
        }).catch((err) => {
          console.log(err);
        });

      }
    }).catch((err) => {
      console.log(err);
    });
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

        window.ACTIONS_database.length().then((numberOfKeys) => {
          if (numberOfKeys > 0) {
            window.ACTIONS_database.key(0).then(keyName => {
              window.ACTIONS_database.getItem(keyName).then(keyValue => {
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
            SignalData.playback = true;
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
        let action = clientMessageADP(msg);
        switch (action.type) {
          case "COURSEWARE_SHOW":
            if (action.handleData.link) {
              SignalData.coursewareLink = action.handleData.link;
            }

            SignalData.broadcast = false;
            this.props.dispatch(switchType({ ...action.handleData }));

            break;

          case "BOARD_TOOLBAR":
            if (SignalData.account == action.handleData.account && SignalData.role == 2) {
              SignalData.broadcast = false;
              action.handleData.show ? this.props.dispatch(showToolbar()) : this.props.dispatch(hideToolbar())
            }
            break;
          default:
            break;
        }
      }

      // 自定义
      if (msg.type) {
        switch (msg.type) {
          case "COURSEWARE_ONLOAD":
            if (SignalData.account == msg.handleData.account) {
              this.coursewareOnload();
            }

            break;
          default:
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
              window.whiteBoardMessage.sendMessage("child", JSON.stringify({ type: msg.action.data.type, handleData: msg.action.data.handleData }));
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
    this.props.dispatch(Object.assign({}, { account: SignalData.account, curPage: window.coursewareCurPage }, e.action));
  }

  // 组件完成挂载
  componentDidMount() {
    console.log("白板组件挂载！")
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
      if (!SignalData.logined) {
        window.whiteBoardMessage.sendMessage('father', 'readyForChannel', '*');
      }
    }

    // ====================
    // 默认账号登录 （供本地测试用）
    // 以老师进入默认频道
    // ====================

    let ran;
    if (isBrowser() == "Chrome") {
      ran = 0;
    } else {
      ran = 2;
    }

    let data = {
      // appId:"7344c75464964565a3515963ec9298ff",
      role: ran,
      uid: ran + "1",
      channel: "123",
      canDraw: true
    }

    console.log(data)
    this.joinChannel(data);

  }

  // 组件将要被卸载
  componentWillUnmount() {
    // 移除监听
    window.whiteBoardMessage.remove();

    // 信令登出
    // 页面刷新或关闭提示
    window.onbeforeunload = function () {
      window.whiteBoardSignal.channel.channelLeave();
    }.bind(this);
  }

  showDefault() {
    window.whiteBoardSignal.channel.messageChannelSend(JSON.stringify({
      sigType: "showCourseware",
      sigValue: {
        value: false,
        link: ""
      },
    }));
  }

  showHtml5() {
    window.whiteBoardSignal.channel.messageChannelSend(JSON.stringify({
      sigType: "showCourseware",
      sigValue: {
        value: true,
        link: "https://www.kunqu.tech/test/index.html"
        // link: "https://res.miaocode.com/livePlatform/courseware/demo03/index.html"
      },
    }));
  }

  showPDF() {
    window.whiteBoardSignal.channel.messageChannelSend(JSON.stringify({
      sigType: "showCourseware",
      sigValue: {
        value: true,
        link: "https://res.miaocode.com/livePlatform/pdf/wxmg.pdf"
      }
    }));

    window.whiteBoardSignal.channel.messageChannelSend(JSON.stringify({
      type: "LOADING_SWITCH",
      handleData: {
        show: true
      },
    }));
  }

  authorization() {
    this.sigValue = this.sigValue ? false : true;
    window.whiteBoardSignal.channel.messageChannelSend(JSON.stringify({
      sigType: "showBrush",
      sigUid: "21",
      sigValue: {
        value: this.sigValue
      }
    }));
  }

  clearCache() {
    window.ACTIONS_database.clear();
    window.BOARD_database.clear();
    window.PAGE_database.clear();
  }

  // loadingSwitch() {
  //   this.loading = this.loading ? false : true;
  //   window.whiteBoardSignal.channel.messageChannelSend(JSON.stringify({
  //     type: "LOADING_SWITCH",
  //     handleData: {
  //       show: this.loading
  //     },
  //   }));
  // }

  render() {
    return <div className="container">
      <WhiteBoard />
      <div className="test showDefault" onClick={() => this.showDefault()}>默认白板</div>
      <div className="test showHtml5" onClick={() => this.showHtml5()}>HTML5课件</div>
      <div className="test showPDF" onClick={() => this.showPDF()}>PDF课件</div>
      <div className="test authorization" onClick={() => this.authorization()}>授权</div>
      <div className="test clearCache" onClick={() => this.clearCache()}>清空缓存</div>

      {/* <div className="test loadingSwitch" onClick={() => this.loadingSwitch()}>loading切换</div> */}
    </div>
  }
}

export default App;