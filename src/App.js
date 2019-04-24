import React, { Component } from 'react';
import fabric from 'fabric';
import GLB from './configs/GLB';
import CoursewareBox from './ui/CoursewareBox';
import SketchpadBox from './ui/SketchpadBox';
import SwitchPage from './ui/SwitchPage';
import BrushBox from './ui/BrushBox';

import sketchpadEngine from './libs/sketchpadEngine';
import signalEngine from './libs/signalEngine';
import signalResponse from './libs/signalResponse';
import messageEngine from './libs/messageEngine';

class App extends Component {
    constructor() {
        super();
        // 用户身份，0：老师；1：助教；2：学生；3：旁听；4：隐身用户; 5:巡课
        this.state = {
            role: 0,
            account: '',
            channel: '',
            showCourseware: {
                value: true,
                link: 'https://www.kunqu.tech/page1/'
            },

            showBrush: false,
            showSketchpad: false,
            showSwitchPage: false,

            tools: [
                {
                    type: 'toolsBox',
                    expand: false,
                    imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/01double.png',
                    attrStyle: null,
                    state: false,
                },
                {
                    type: 'sketchpad',
                    state: true,
                    imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/02double.png',
                    attrStyle: null
                },
                {
                    type: 'pen',
                    state: false,
                    imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/03double.png',
                    attrStyle: {
                        height: '120px'
                    },
                    attr: ['penSize', 'penColor']
                },
                {
                    type: 'text',
                    state: false,
                    imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/04double.png',
                    attrStyle: {
                        height: '120px'
                    },
                    attr: ['textSize', 'penColor']
                },
                {
                    type: 'graph',
                    state: false,
                    imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/07double.png',
                    attrStyle: {
                        height: '150px'
                    },
                    attr: ['penShape', 'penColor']
                },
                {
                    type: 'remove',
                    state: false,
                    imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/06double.png',
                    attrStyle: null
                },
                {
                    type: 'empty',
                    state: false,
                    imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/05double.png',
                    attrStyle: null
                },
            ],
            sketchpadConfig: {
                penSize: 2,
                textSize: 14,
                penColor: '#fff',
                penShape: ''
            },
            position: {
                top: '100px',
                right: '60px'
            },
            toolsCache: {
                preIndex: 1,
                preState: null
            },
            switchPage: {
                leftIcon: false,
                rightIcon: true,
                towardsPage: 1,
                totalPage: 4,
            }
        }

        // let account = Math.floor(Math.random() * 100);
        // let data = {
        //     role: 0,
        //     uid: account,
        //     channel: 'q2',
        //     canDraw: true
        // }
        // this.loginChannel(data);
    }

    componentDidMount() {
        this.findDimensions();
        window.onresize = this.findDimensions;
        // 课件iframe
        this.coursewareIframe = document.getElementById("coursewareIframe").contentWindow;
        // message监听
        this.message = new messageEngine(this.listenPostMessage.bind(this));
        // console.log(this.message);
        this.message.listen();
        // 画板实例化
        this.sketchpad = new sketchpadEngine(function (method, context, pars) {
            this.broadcastMessage('sketchpad', method, context, pars);
        }.bind(this));

        // DOM加载完毕，请求用户信息及登录
        this.message.sendMessage('father', 'readyForChannel', '*');
        if (window.webkit) {
            window.webkit.messageHandlers.readyForChannel.postMessage('readyForChannel');
            window.receiveResourceInfoFun = function (data) {
                if (!GLB.logined) {
                    if (typeof data == 'string') data = JSON.parse(data);
                    this.loginChannel(data);
                }
            }.bind(this);
        }
    }

    // ====================
    // 随意缩放导致画板出现bug，需重新实例化
    // ====================

    findDimensions() {
        let winWidth = 0;
        let winHeight = 0;
        //函数：获取尺寸
        //获取窗口宽度
        if (window.innerWidth) {
            winWidth = window.innerWidth;
        } else if ((document.body) && (document.body.clientWidth)) {
            winWidth = document.body.clientWidth;
        }
        //获取窗口高度
        if (window.innerHeight) {
            winHeight = window.innerHeight;
        } else if ((document.body) && (document.body.clientHeight)) {
            winHeight = document.body.clientHeight;
        }

        let whiteboardBox = document.getElementById('whiteboardBox');
        let sketchpad = document.getElementById('sketchpad');
        let rate = winWidth/winHeight;

        if(rate > 16/9){
            whiteboardBox.style.width = winHeight*16/9 + 'px';
            whiteboardBox.style.height = winHeight + 'px';
            sketchpad.width = winHeight*16/9;
            sketchpad.height = winHeight;
        } else {
            whiteboardBox.style.width = winWidth + 'px';
            whiteboardBox.style.height = winWidth*9/16 + 'px';
            sketchpad.width = winWidth;
            sketchpad.height = winWidth*9/16;
        }
    }

    componentWillMount() {
        //页面刷新或关闭提示
        window.onbeforeunload = function (event) {
            this.engine.channel.channelLeave();
        }.bind(this);
    }

    componentWillUnmount() {
        this.message.remove();
    }

    // 新用户注册，加入频道
    loginChannel(data) {
        console.log('登陆中...');
        // 
        signalEngine(data, function (engine) {
            console.log('登陆成功...');
            this.engine = engine;
            GLB.logined = true;
            this.setState({
                account: GLB.account,
                channel: GLB.channel,
                showBrush: GLB.canDraw,
                showSwitchPage: GLB.role == 0 ? true : false
            })
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
                            showBrush: data.sigValue.value ? true : false
                        })
                    }
                    break;
                /****展示课件*****/
                case 'showCourseware':
                    this.setState({
                        showCourseware: {
                            value: data.sigValue.value ? true : false,
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
        if (!GLB.logined && typeof e.data == 'string' && e.data !== "") {
            let data = JSON.parse(e.data);
            if (data.uid && data.channel) this.loginChannel(data);
        } else {
            //if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            if (!this.engine) return console.log('请先登录及加入频道！');
            let data = JSON.parse(e.data);
            this.broadcastMessage('courseware', null, null, data);
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

    sketchpadChange(pars, boolean) {
        let newConfig = this.state.sketchpadConfig;
        newConfig[pars.type] = pars.value;
        this.setState({ sketchpadConfig: newConfig });

        let data = {};
        switch (pars.type) {
            case 'penShape':
                data.type = 'drawType';
                data.value = pars.value;
                break;
            case 'penSize':
                data.type = 'drawWidth';
                data.value = pars.value;
                break;
            case 'penColor':
                data.type = 'color';
                data.value = pars.value;
                break;
            case 'textSize':
                data.type = 'textSize';
                data.value = pars.value;
                break;
        }
        this.sketchpad.changeConfig(data);

        if (boolean) this.broadcastMessage('whiteboard', 'sketchpadChange', null, pars);
    }

    childCallback(pars) {
        let showState = null;

        if (this.sketchpad.textbox) {
            // 退出文本编辑状态
            this.sketchpad.textbox.exitEditing();
            this.sketchpad.textbox = null;
        }

        switch (pars.type) {
            case 'sketchpad':
                showState = false;
                break;
            case 'pen':
                showState = true;
                this.sketchpad.canvas.isDrawingMode = true;
                this.sketchpad.drawType = ''
                break;
            case 'text':
                showState = true;
                this.sketchpad.drawType = pars.type;
                this.sketchpad.canvas.isDrawingMode = false;
                this.sketchpad.canvas.skipTargetFind = true;
                this.sketchpad.canvas.selection = false;
                break;
            case 'graph':
                showState = true;
                this.sketchpad.drawWidth = 2;
                this.sketchpad.drawType = this.state.sketchpadConfig.penShape;
                this.sketchpad.canvas.isDrawingMode = false;
                this.sketchpad.canvas.skipTargetFind = true;
                this.sketchpad.canvas.selection = false;
                break;
            case 'remove':
                showState = true;
                this.sketchpad.drawType = pars.type;
                this.sketchpad.canvas.isDrawingMode = false;
                this.sketchpad.canvas.selection = true;
                this.sketchpad.canvas.skipTargetFind = false;
                this.sketchpad.canvas.selectable = true;
                break;
            case 'empty':
                showState = true;

                this.sketchpad.removeAll()
                break;
        }
        if (showState !== null) this.setState({ showSketchpad: showState });
    }

    handleClick(pars) {
        let toolsArray = this.state.tools;
        let showState = false;
        let index = pars.index;
        let newToolsArray;

        if (this.sketchpad.textbox) {
            // 退出文本编辑状态
            this.sketchpad.textbox.exitEditing();
            this.sketchpad.textbox = null;
        }

        switch (pars.type) {
            case 'toolsBox':
                toolsArray[index].expand = toolsArray[index].expand ? false : true;
                newToolsArray = toolsArray;
                showState = this.state.showSketchpad;
                break;
            case 'sketchpad':
            case 'pen':
            case 'text':
            case 'graph':
            case 'remove':
            case 'empty':
                newToolsArray = toolsArray.map(function (m, n, arr) {
                    if (n == index) {
                        arr[n].state = arr[n].state ? false : true;
                    } else {
                        arr[n].state = false;
                    }
                    return m;
                })

                showState = Object.is(pars.type, 'sketchpad') ? false : true;
                break;
        }
        this.setState({ showSketchpad: showState, tools: newToolsArray });
    }

    render() {
        let basicInfo = {
            position: 'absolute', top: '30px', left: '20px', 'zIndex': '4'
        }

        return (<div id="whiteboardBox" className="whiteboardBox">
            <CoursewareBox state={this.state.showCourseware} />
            <SketchpadBox state={this.state.showSketchpad} />
            <BrushBox showBrush={this.state.showBrush} sketchpadChange={this.sketchpadChange.bind(this)} childCallback={this.childCallback.bind(this)} broadcastMessage={this.broadcastMessage.bind(this)} tools={this.state.tools} sketchpadConfig={this.state.sketchpadConfig} position={this.state.position} toolsCache={this.state.toolsCache} />
            <SwitchPage showSwitchPage={this.state.showSwitchPage} switchPage={this.state.switchPage} jumpPage={this.jumpPage.bind(this)} />
            <div style={basicInfo}>
                <label>账号：</label>
                <p>{this.state.account}</p>
                <label>频道：</label>
                <p>{this.state.channel}</p>
            </div>
        </div>
        );
    }
}

export default App;
