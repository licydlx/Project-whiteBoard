// 用户身份，0：老师；1：助教；2：学生；3：旁听；4：隐身用户; 5:巡课

import React, { Component } from 'react';
import fabric from 'fabric';
import GLB from './configs/GLB';
import localforage from 'localforage';

import stateConfig from './stateConfig';
import { jumpPage } from './civilServant';
import { listenPostMessage, listenSignalMessage, handleMessage } from './diplomat';

import CoursewareBox from './ui/CoursewareBox';
import SketchpadBox from './ui/SketchpadBox';
import SwitchPage from './ui/SwitchPage';
import BrushBox from './ui/BrushBox';

import { findDimensions } from './libs/toolSet';
import sketchpadEngine from './libs/sketchpadEngine';
import signalEngine from './libs/signalEngine';
import signalResponse from './libs/signalResponse';
import messageEngine from './libs/messageEngine';

class App extends Component {
    constructor() {
        super();
        this.state = stateConfig;
        this.message = new messageEngine(listenPostMessage.bind(this));
        this.message.listen();
        this.jumpPage = jumpPage.bind(this);
        this.syncCacheData = [];
        this.localforage = localforage;
        this.handleMessage = handleMessage.bind(this);
        this.currentPage = 1;
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
        this.loginChannel(data);
    }

    componentDidMount() {
        // DOM加载完毕，web请求用户信息及登录
        this.message.sendMessage('father', 'readyForChannel', '*');
        // IOS请求用户信息及登录
        if (window.webkit) {
            window.webkit.messageHandlers.readyForChannel.postMessage('readyForChannel');
            window.receiveResourceInfoFun = function (data) {
                if (!GLB.logined) {
                    if (typeof data == 'string') data = JSON.parse(data);
                    this.loginChannel(data);
                }
            }.bind(this);
        }
        // 屏幕尺寸自适应
        findDimensions();
        window.onresize = findDimensions();
        // 课件iframe
        this.coursewareIframe = document.getElementById("coursewareIframe").contentWindow;
        // 画板实例化
        this.sketchpad = new sketchpadEngine(function (method, context, pars) {
            this.broadcastMessage('sketchpad', method, context, pars);
        }.bind(this));
    }

    componentWillMount() {
        // 页面刷新或关闭提示
        window.onbeforeunload = function (event) {
            this.engine.channel.channelLeave();
        }.bind(this);
    }

    componentWillUnmount() {
        // 移除监听
        this.message.remove();
    }

    // 新用户注册，加入频道
    loginChannel(data) {
        signalEngine(data, function (engine) {
            // 接入声网信令sdk对应的回调 
            signalResponse(engine, listenSignalMessage.bind(this));
            this.engine = engine;
            GLB.logined = true;

            console.log('登录成功！！！')
            // 老师角色为0
            if (GLB.role == 0) {
                const newBrush = Object.assign({}, this.state.brush, { show: GLB.canDraw });
                let date = new Date();
                let today = date.getDate();
                let name = GLB.role + '-' + GLB.channel + '-' + today;
                let curPage = 'page' + this.state.switchPage.currentPage;
                // 配置不同的驱动优先级
                this.localforage.config({
                    driver: [this.localforage.INDEXEDDB,
                    this.localforage.WEBSQL,
                    this.localforage.LOCALSTORAGE],
                    name: name,
                    description: '白板缓存机制'
                });

                this.setState({
                    brush: newBrush
                }, () => {
                    this.setPageCacheValue(curPage);
                });
            }
        }.bind(this));
    }

    // 设置缓存页面默认值
    setPageCacheValue(curPage) {
        this.localforage.getItem(curPage, function (err, value) {
            if (!Array.isArray(value)) {
                this.localforage.setItem(curPage, []);
            } else {
                this.playBack(this.state.switchPage.currentPage);
            }
        }.bind(this));
    }

    getCurPageCache(callback) {
        let newCache = [];
        let curPage = 'page' + this.state.switchPage.currentPage;
        this.localforage.getItem(curPage, function (err, value) {
            if (!Array.isArray(value)) return;
            if (value == []) return;
            // 信令通道8k,拆分传输数据
            let z = Math.ceil(value.length / 20);
            for (let seq = 0; seq <= z; seq++) {
                if (seq === z) return callback({ syncCacheEnd: true })
                newCache = [];
                value.forEach((element, index) => {
                    if (Object.is(element.belong, "sketchpad") || Object.is(element.belong, "whiteboard")) {
                        if (index < 20 * (seq + 1) && index >= seq * 20) {
                            newCache.push(element);
                        }
                    }
                });

                if (callback) callback({
                    key: seq,
                    value: newCache
                });
            }
        })
    }

    peerToPeer(account, msg, callback) {
        this.engine.session.messageInstantSend(account, JSON.stringify(msg), callback);
    }

    // 广播message
    broadcastMessage(belong, method, context, pars) {
        // account 账号识别
        let data = {
            account: GLB.account,
            belong: belong,
            method: method,
            context: context,
            pars: pars
        }
        if (!this.engine) return console.log('请先登录及加入频道！');

        // 存储老师端的通信message
        if (Object.is(GLB.role, 0)) {
            let curPage = 'page' + this.state.switchPage.currentPage;
            this.localforage.getItem(curPage, function (err, value) {
                if (Array.isArray(value)) {
                    value.push(data);
                } else {
                    value = [];
                }
                this.localforage.setItem(curPage, value).then(function (v) {
                    this.engine.channel.messageChannelSend(JSON.stringify(data));
                }.bind(this)).catch(function (err) {
                    console.log(err);
                });
            }.bind(this));
        } else {
            this.engine.channel.messageChannelSend(JSON.stringify(data));
        }
    }

    sketchpadChoosedCallback(newBrush, boolean) {
        let pars = newBrush.sketchpad;
        switch (pars.type) {
            case 'pen':
                this.sketchpad.canvas.freeDrawingBrush.color = pars.penColor;
                this.sketchpad.canvas.freeDrawingBrush.width = pars.penSize;
                this.sketchpad.drawConfig.penSize = pars.penSize;
                this.sketchpad.drawConfig.penColor = pars.penColor;
                break;
            case 'text':
                this.sketchpad.drawConfig.textSize = pars.textSize;
                this.sketchpad.drawConfig.penColor = pars.penColor;
                break;
            case 'graph':
                this.sketchpad.drawConfig.penShape = pars.penShape;
                this.sketchpad.drawConfig.penColor = pars.penColor;
                break;
        }

        this.setState({
            brush: newBrush
        })

        if (!boolean) this.broadcastMessage('whiteboard', 'sketchpadChoosedCallback', null, newBrush);
    }

    brushChoosedCallback(newBrush, boolean) {
        let pars = newBrush.sketchpad;
        if (this.sketchpad.textbox) {
            // 退出文本编辑状态
            this.sketchpad.textbox.exitEditing();
            this.sketchpad.textbox = null;
        }
        switch (pars.type) {
            case 'pen':
                newBrush.sketchpad.penShape = '';
                break;
            case 'text':
                newBrush.sketchpad.penShape = pars.type;
                break;
            case 'graph':
                newBrush.sketchpad.penSize = 2;
                newBrush.sketchpad.penShape = 'line';
                break;
            case 'remove':
                newBrush.sketchpad.penShape = pars.type;
                break;
        }

        this.setState({
            brush: newBrush
        });

        if (!boolean) this.broadcastMessage('whiteboard', 'brushChoosedCallback', null, newBrush);
    }

    fullScreen(pars, boolean) {
        this.setState({
            switchPage: pars
        })
    }

    // 白板回放
    playBack(pageNum) {
        let curPage = 'page' + pageNum;

        this.localforage.getItem(curPage, function (err, value) {
            if (!value) return;
            let total = value.length;
            let num = 0;
            const work = function (total, message) {
                this.handleMessage(JSON.stringify(message));
                if (num + 1 == total) {
                    console.log(value[num]);
                    console.log(typeof value[num]);
                    if (value[num].method == 'jumpPage') {
                        this.playBack(value[num].pars.handleData.pars);
                    }
                    return;
                }
                num++;
                setTimeout(function () {
                    work(total, value[num]);
                }, 1000)
            }.bind(this);
            work(total, value[num]);
        }.bind(this));
    }

    render() {
        let sketchpad = this.state.brush.sketchpad;
        switch (sketchpad.type) {
            case 'pen':
                this.sketchpad.canvas.isDrawingMode = true;
                this.sketchpad.canvas.freeDrawingBrush.color = sketchpad.penColor;
                this.sketchpad.canvas.freeDrawingBrush.width = sketchpad.penSize;
                this.sketchpad.drawConfig.penShape = '';
                break;
            case 'text':
                this.sketchpad.canvas.isDrawingMode = false;
                this.sketchpad.canvas.skipTargetFind = true;
                this.sketchpad.canvas.selection = false;
                this.sketchpad.drawConfig.penShape = sketchpad.penShape;
                break;
            case 'graph':
                this.sketchpad.canvas.isDrawingMode = false;
                this.sketchpad.canvas.skipTargetFind = true;
                this.sketchpad.canvas.selection = false;

                this.sketchpad.drawConfig.penSize = 2;
                this.sketchpad.drawConfig.penShape = sketchpad.penShape;
                break;
            case 'remove':
                this.sketchpad.canvas.isDrawingMode = false;
                this.sketchpad.canvas.selection = true;
                this.sketchpad.canvas.skipTargetFind = false;
                this.sketchpad.canvas.selectable = true;

                this.sketchpad.drawConfig.penShape = sketchpad.penShape;
                break;
            case 'empty':
                this.sketchpad.removeAll()
                break;
        }

        // 页面切换时，根据对应页面缓存改变状态
        let pageNum = this.state.switchPage.currentPage;
        console.log('render');
        console.log(pageNum);
        if (this.currentPage !== pageNum) {
            let curPage = 'page' + pageNum;
            this.localforage.getItem(curPage, function (err, value) {
                this.sketchpad.removeAll();
                if (value && value.length > 0) {
                    value.forEach(message => {
                        if(Object.is(message.method,'jumpPage')) return;
                        this.handleMessage(JSON.stringify(message));
                    });
                }
                this.currentPage = pageNum;
            }.bind(this));
        }

        return (<div id="whiteboardBox" className="whiteboardBox">
            <CoursewareBox state={this.state.course} />
            <SketchpadBox state={this.state.brush} />
            <BrushBox state={this.state.brush} brushChoosedCallback={this.brushChoosedCallback.bind(this)} sketchpadChoosedCallback={this.sketchpadChoosedCallback.bind(this)} />
            <SwitchPage state={this.state.switchPage} jumpPage={this.jumpPage} fullScreen={this.fullScreen.bind(this)} />
        </div>
        );
    }
}

export default App;
