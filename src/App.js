// 用户身份，0：老师；1：助教；2：学生；3：旁听；4：隐身用户; 5:巡课

import React, { Component } from 'react';
import fabric from 'fabric';
import GLB from './configs/GLB';
import localforage from 'localforage';

import stateConfig from './stateConfig';

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

        // message监听
        this.message = new messageEngine(this.listenPostMessage.bind(this));
        this.message.listen();

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

        // 配置不同的驱动优先级
        // localforage.config({
        //     driver: [localforage.INDEXEDDB,
        //     localforage.WEBSQL,
        //     localforage.LOCALSTORAGE],
        //     name: "courseCache",
        //     description: '白板缓存机制'
        // });

        // 时间戳
        // 设置某个数据仓库 key 的值不会影响到另一个数据仓库
        // let key = + new Date();
        // localforage.setItem(key, {
        //     type:''
        // });
        // store.setItem('ydlx', [1, 2, 'three']).then(this.doSomethingElse);
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
        this.sketchpad = new sketchpadEngine(this.state.brush.sketchpad,function (method, context, pars) {
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
            console.log('登陆成功...');
            this.engine = engine;
            GLB.logined = true;
            this.setState({
                showBrush: GLB.canDraw
            })

            if (GLB.role == 0) {
                // let newSwitchPage = this.state.switchPage;
                // newSwitchPage.show = true;
                // this.setState({
                //     switchPage: newSwitchPage
                // }) 
            }

            // 接入声网信令sdk对应的回调 
            signalResponse(this.engine, this.listenSignalMessage.bind(this));
        }.bind(this));
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
        // let key = + new Date();
        // localforage.setItem(key + '', data);
        this.engine.channel.messageChannelSend(JSON.stringify(data));
    }

    // 接受信令消息
    listenSignalMessage(config) {
        if (typeof config !== 'string') return console.log('接受信令的消息应为string');
        let data = JSON.parse(config);
        // 外壳与白板通信
        if (data.sigType) {
            switch (data.sigType) {
                /***画板操作****/
                case 'showBrush':
                    // 画板显示与隐藏（授权）
                    let uid = data.sigUid + '123';
                    if (GLB.account == uid && GLB.role == '2') {
                        this.setState({
                            brush: {
                                show: data.sigValue.value ? true : false
                            }
                        })
                    }
                    break;
                /****展示课件*****/
                case 'showCourseware':
                    this.setState({
                        course: {
                            show: data.sigValue.value ? true : false,
                            link: data.sigValue.value ? data.sigValue.link : ''
                        }
                    })
                    break;
            }
        }

        if (data.belong) {
            // 自己广播的信令，自己不执行
            if (data.account === GLB.account) return;
            switch (data.belong) {
                // 白板与白板通信
                case 'whiteboard':
                    // 显示或者隐藏画布
                    // 画笔切换
                    this[data.method](data.pars);
                    break;

                // 白板与画板通信
                case 'sketchpad':
                    // 画板绘画操作
                    if (data.method === 'removeBlock') {
                        let unRemovedSub = JSON.parse(data.pars);
                        let total = this.sketchpad.canvas._objects;
                        this.sketchpad.canvas._objects = [];
                        if (unRemovedSub.length == 0) {
                            this.sketchpad.canvas.add();
                        }
                        for (let x = 0; x < unRemovedSub.length; x++) {
                            this.sketchpad.canvas.add(total[parseInt(unRemovedSub[x])]);
                        }
                        return;
                    }
                    if (data.context === 'mouseDown') this.sketchpad.doDrawing = true;
                    if (data.context === 'mouseUp') {
                        this.sketchpad.drawingObject = null;
                        this.sketchpad.doDrawing = false;
                        this.sketchpad.moveCount = 1;
                        this.sketchpad.doDrawing = false;
                    }
                    if (data.method) this.sketchpad[data.method](data.context, data.pars);
                    break;
                // 白板与课件通信
                case 'courseware':
                    if (data.pars.type == 'jumpPage') this.jumpPage(data.pars.switchPage);
                    break;
            }
        }
    }

    // 接受postmessage消息
    listenPostMessage(e) {
        if (typeof e.data !== 'string' || e.data == '') return;
        let data = JSON.parse(e.data);
        // GLB.logined 是否已登录频道
        if (GLB.logined) {
            this.broadcastMessage('courseware', null, null, data);
        } else {
            if (data.uid && data.channel) this.loginChannel(data);
        }
    };

    // 白板跳到某页
    jumpPage(switchPage, boolean) {
        let data = {
            belong: 'courseware',
            type: 'jumpPage',
            switchPage: switchPage,
            handleData: {
                method: 'swithScene',
                pars: switchPage.towardsPage
            }
        }

        this.setState({
            switchPage: switchPage
        })

        // 翻页时清空画板
        this.sketchpad.removeAll();

        this.message.sendMessage('child', data, this.coursewareIframe);
        if (boolean) this.broadcastMessage('courseware', null, null, data);
    }

    sketchpadChoosedCallback(pars, boolean) {
        const brush = Object.assign({}, this.state.brush, {sketchpad: pars});
        this.setState({
            brush: brush
        });

        console.log('sketchpadChoosedCallback')
        console.log(this.sketchpad);
        this.sketchpad.color = 'red';
        this.sketchpad.drawWidth = 8;
        this.sketchpad.canvas.freeDrawingBrush.color = 'red';
        this.sketchpad.canvas.freeDrawingBrush.width = 8;
        // switch (pars.type) {
        //     case 'pen':
        //     this.sketchpad.canvas.freeDrawingBrush.color = pars.penColor;
        //     this.sketchpad.canvas.freeDrawingBrush.width = pars.penSize;

        //     this.sketchpad.color = pars.penColor;
        //     this.sketchpad.drawWidth = pars.penSize;
        //     break;
        // }
        // if (boolean) this.broadcastMessage('whiteboard', 'sketchpadChange', null, pars);
    }

    brushChoosedCallback(pars) {
        if (this.sketchpad.textbox) {
            // 退出文本编辑状态
            this.sketchpad.textbox.exitEditing();
            this.sketchpad.textbox = null;
        }

        switch (pars.type) {
            case 'pen':
                this.sketchpad.canvas.isDrawingMode = true;
                this.sketchpad.drawType = ''
                break;
            case 'text':
                this.sketchpad.drawType = pars.type;
                this.sketchpad.canvas.isDrawingMode = false;
                this.sketchpad.canvas.skipTargetFind = true;
                this.sketchpad.canvas.selection = false;
                break;
            case 'graph':
                this.sketchpad.drawWidth = 2;
                this.sketchpad.drawType = pars.penShape;
                this.sketchpad.canvas.isDrawingMode = false;
                this.sketchpad.canvas.skipTargetFind = true;
                this.sketchpad.canvas.selection = false;
                break;
            case 'remove':
                this.sketchpad.drawType = pars.type;
                this.sketchpad.canvas.isDrawingMode = false;
                this.sketchpad.canvas.selection = true;
                this.sketchpad.canvas.skipTargetFind = false;
                this.sketchpad.canvas.selectable = true;
                break;
            case 'empty':
                this.sketchpad.removeAll()
                break;
        }

        const brush = Object.assign({}, this.state.brush, {sketchpad: pars});
        this.setState({
            brush: brush
        });
    }

    render() {
        return (<div id="whiteboardBox" className="whiteboardBox">
            <CoursewareBox state={this.state.course} />
            <SketchpadBox state={this.state.brush} />
            {/* <BrushBox showBrush={this.state.showBrush} sketchpadChange={this.sketchpadChange.bind(this)} childCallback={this.childCallback.bind(this)} broadcastMessage={this.broadcastMessage.bind(this)} tools={this.state.tools} sketchpadConfig={this.state.sketchpadConfig} position={this.state.position} toolsCache={this.state.toolsCache} /> */}
            <BrushBox state={this.state.brush} brushChoosedCallback={this.brushChoosedCallback.bind(this)} sketchpadChoosedCallback={this.sketchpadChoosedCallback.bind(this)} />
            <SwitchPage state={this.state.switchPage} jumpPage={this.jumpPage.bind(this)} />
        </div>
        );
    }
}

export default App;
