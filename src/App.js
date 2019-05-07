// 用户身份，0：老师；1：助教；2：学生；3：旁听；4：隐身用户; 5:巡课

import React, { Component } from 'react';
import fabric from 'fabric';
import GLB from './configs/GLB';
import localforage from 'localforage';

import stateConfig from './stateConfig';
import { jumpPage } from './civilServant';
import { listenPostMessage, listenSignalMessage } from './diplomat';

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
        this.sketchpad = new sketchpadEngine(this.state.brush.sketchpad, function (method, context, pars) {
            this.broadcastMessage('sketchpad', method, context, pars);
        }.bind(this));

        console.log('this.sketchpad');
        console.log(this.sketchpad);
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
            // 接入声网信令sdk对应的回调 
            signalResponse(engine, listenSignalMessage.bind(this));
            this.engine = engine;
            GLB.logined = true;
            // 老师角色为0
            if (GLB.role == 0) {
                const newBrush = Object.assign({}, this.state.brush, { show: GLB.canDraw });
                this.setState({
                    brush: newBrush
                })
            }
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
        console.log(data);
        this.engine.channel.messageChannelSend(JSON.stringify(data));
    }

    sketchpadChoosedCallback(newBrush, boolean) {
        let pars = newBrush.sketchpad;
        switch (pars.type) {
            case 'pen':
                this.sketchpad.canvas.freeDrawingBrush.color = pars.penColor;
                this.sketchpad.canvas.freeDrawingBrush.width = pars.penSize;
                this.sketchpad.color = pars.penColor;
                this.sketchpad.drawWidth = pars.penSize;
            break;
            case 'text':
                this.sketchpad.textSize = pars.textSize;
                this.sketchpad.color = pars.penColor;
            break;
            case 'graph':
                this.sketchpad.drawType = pars.penShape;
                this.sketchpad.color = pars.penColor;
            break;
        }
        this.setState({
            brush: newBrush
        });
        if (boolean) this.broadcastMessage('whiteboard', 'sketchpadChoosedCallback', null, newBrush);
    }

    brushChoosedCallback(newBrush,boolean) {
        let pars = newBrush.sketchpad;
        if (this.sketchpad.textbox) {
            // 退出文本编辑状态
            this.sketchpad.textbox.exitEditing();
            this.sketchpad.textbox = null;
        }
        switch (pars.type) {
            case 'pen':
                this.sketchpad.canvas.isDrawingMode = true;
                this.sketchpad.drawType = '';
                this.sketchpad.canvas.freeDrawingBrush.color = pars.penColor;
                this.sketchpad.canvas.freeDrawingBrush.width = pars.penSize;

                newBrush.penShape = '';
                break;
            case 'text':
                this.sketchpad.drawType = pars.type;
                this.sketchpad.canvas.isDrawingMode = false;
                this.sketchpad.canvas.skipTargetFind = true;
                this.sketchpad.canvas.selection = false;

                newBrush.penShape = pars.type;
                break;
            case 'graph':
                this.sketchpad.drawWidth = 2;
                this.sketchpad.drawType = pars.penShape;
                this.sketchpad.canvas.isDrawingMode = false;
                this.sketchpad.canvas.skipTargetFind = true;
                this.sketchpad.canvas.selection = false;

                newBrush.penSize = 2;
                break;
            case 'remove':
                this.sketchpad.drawType = pars.type;
                this.sketchpad.canvas.isDrawingMode = false;
                this.sketchpad.canvas.selection = true;
                this.sketchpad.canvas.skipTargetFind = false;
                this.sketchpad.canvas.selectable = true;

                newBrush.penShape = pars.type;
                break;
            case 'empty':
                this.sketchpad.removeAll()
                break;
        }

        this.setState({
            brush: newBrush
        });

        if (boolean) this.broadcastMessage('whiteboard', 'brushChoosedCallback', null, newBrush);
    }

    fullScreen(pars,boolean){
        this.setState({
            switchPage: pars
        })
    }

    render() {
        return (<div id="whiteboardBox" className="whiteboardBox">
            <CoursewareBox state={this.state.course} />
            <SketchpadBox state={this.state.brush} />
            {/* <BrushBox showBrush={this.state.showBrush} sketchpadChange={this.sketchpadChange.bind(this)} childCallback={this.childCallback.bind(this)} broadcastMessage={this.broadcastMessage.bind(this)} tools={this.state.tools} sketchpadConfig={this.state.sketchpadConfig} position={this.state.position} toolsCache={this.state.toolsCache} /> */}
            <BrushBox state={this.state.brush} brushChoosedCallback={this.brushChoosedCallback.bind(this)} sketchpadChoosedCallback={this.sketchpadChoosedCallback.bind(this)} />
            <SwitchPage state={this.state.switchPage} jumpPage={this.jumpPage} fullScreen={this.fullScreen.bind(this)}/>
        </div>
        );
    }
}

export default App;
