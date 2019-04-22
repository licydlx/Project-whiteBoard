import React, { Component } from 'react';
import fabric from 'fabric';
import GLB from './configs/GLB';
import CoursewareBox from './ui/CoursewareBox';
import SketchpadBox from './ui/SketchpadBox';

import Test from './Test';
// import ToolBox from './ui/ToolBox';
// import sketchpadEngine from './libs/sketchpadEngine';
//import sketchpad from './libs/sketchpad';
import sketchpadEngine from './libs/sketchpadEngine';
import signalEngine from './libs/signalEngine';
import signalResponse from './libs/signalResponse';
import messageEngine from './libs/messageEngine';

class App extends Component {
    constructor() {
        super();

        // 用户身份，0：老师；1：助教；2：学生；3：旁听；4：隐身用户; 5:巡课
        this.state = {
            currentPage: 1,
            sub: 0,
            role: 0,
            account: '',
            channel: '',

            showCourseware: {
                value: true,
                link: 'https://www.kunqu.tech/page1/'
            },
            showBrush: false,
            showSketchpad: false,
            showSwitchpage: false,
            tools:[
                {
                    'data-type': 'eye',
                    'state': false
                },
                {
                    'data-type': 'pen',
                    'state': false
                },
                {
                    'data-type': 'arrow',
                    'state': false
                },
                {
                    'data-type': 'line',
                    'state': false
                },
                {
                    'data-type': 'ellipse',
                    'state': false
                }, {
                    'data-type': 'rectangle',
                    'state': false
                },
                {
                    'data-type': 'text',
                    'state': false
                }, {
                    'data-type': 'remove',
                    'state': false
                }
            ]
        }



        let account = Math.floor(Math.random() * 100);
        let data = {
            role: 0,
            uid: account,
            channel: 'q2',
            canDraw: true
        }
        this.loginChannel(data);

        //"{"role":2,"uid":"111111","channel":"miaoCode12","canDraw":false}"
    }

    componentDidMount() {
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
            this.engine = engine;
            GLB.logined = true;

            this.setState({
                account: GLB.account,
                channel: GLB.channel,
                showBrush: GLB.canDraw,
                showSwitchpage: GLB.role == 0 ? true : false
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
                    console.log('画板操作');
                    console.log(data);
                    // 画板显示与隐藏（授权）
                    let uid = data.sigUid + '123';
                    if (GLB.account == uid && GLB.role == '2') {
                        this.setState({
                            showBrush: data.sigValue.value ? true : false,
                            showSwitchpage: data.sigValue.value ? true : false
                        })
                    }
                    break;
                /****展示课件*****/
                case 'showCourseware':
                    console.log('展示课件');
                    console.log(data);
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
                    if (data.pars.type == 'jumpPage') {
                        this.setState({
                            currentPage: data.pars.handleData.pars
                        })
                    }
                    // 白板向子级窗口传递message
                    this.message.sendMessage('child', JSON.stringify(data.pars), this.coursewareIframe)
                    break;
            }
        }

    }

    // 接受postmessage消息
    listenPostMessage(e) {
        if (!GLB.logined && typeof e.data == 'string' && e.data !== "") {
            let data = JSON.parse(e.data);
            if (data.uid && data.channel) this.loginChannel(JSON.parse(e.data));
        } else {
            //if (window === window.parent) return;
            if (typeof e.data !== 'string') return;
            if (!this.engine) return console.log('请先登录及加入频道！');
            let data = JSON.parse(e.data);
            this.broadcastMessage('courseware', null, null, data);
        }
    };

    // 白板跳到某页
    jumpPage(changeNum, e) {
        if (e) e.preventDefault();
        let pars = this.state.currentPage + parseInt(changeNum);
        if (pars < 1) return;

        this.setState({
            currentPage: pars
        })

        let data = {
            belong: 'courseware',
            type: 'jumpPage',
            handleData: {
                method: 'swithScene',
                pars: pars
            }
        }
        this.message.sendMessage('child', data, this.coursewareIframe);
        this.broadcastMessage('courseware', null, null, data);
    }

    handleClick(sub, e) {
        console.log(sub);
        console.log(e);

        if (sub) {
            this.showOrHide(null, true);
            return;
        }
         if (e) this.broadcastMessage('whiteboard', 'handleClick', null, JSON.stringify(true));
        // if (e) e.preventDefault();
        // if (typeof sub == 'string') sub = parseInt(sub);
        // let toolsArr = this.state.tools;

        // if (toolsArr[sub]['data-type'] == 'eye') {
        //     this.showOrHide(null, true);
        //     return;
        // }

        // if (this.sketchpad.textbox) {
        //     // 退出文本编辑状态
        //     this.sketchpad.textbox.exitEditing();
        //     this.sketchpad.textbox = null;
        // }

        // let newTools = toolsArr.map(function (value, index) {
        //     if (sub === index) {
        //         value.state = true;
        //         let type = value['data-type'];
        //         this.sketchpad.drawType = type;
        //         this.sketchpad.canvas.isDrawingMode = false;
        //         if (type == 'remove') {
        //             this.sketchpad.canvas.selection = true;
        //             this.sketchpad.canvas.skipTargetFind = false;
        //             this.sketchpad.canvas.selectable = true;
        //         } else if (type == 'pen') {
        //             this.sketchpad.canvas.isDrawingMode = true;
        //         } else {
        //             // 画板元素不能被选中
        //             this.sketchpad.canvas.skipTargetFind = true;
        //             // 画板不显示选中
        //             this.sketchpad.canvas.selection = false;
        //         }
        //     } else {
        //         value.state = false;
        //     }
        // }.bind(this));

        // this.setState({ tools: newTools });
        // if (e) this.broadcastMessage('whiteboard', 'handleClick', null, JSON.stringify(sub));
    }

    // 显示或者隐藏
    showOrHide(boolean, e) {
        this.setState({ showSketchpad: this.state.showSketchpad ? false : true })
        if (e) this.broadcastMessage('whiteboard', 'showOrHide');
    }

    render() {
        let sub = this.state.sub;
        let toolsArr = this.state.tools;
        toolsArr[sub]['state'] = true;

        const items = toolsArr.map((value, index) => {
            return <div data-type={value['data-type']} key={index} className={`toolFace ${value['state'] ? 'active' : ''}`} onClick={this.handleClick.bind(this, index)}>
                {/* <i className={`icon-tools ${value['className']}`} data-default={`icon-tools ${value['data-default']}`}></i> */}
            </div>
        });

        let showBrush = {
            display: `${this.state.showBrush ? 'flex' : 'none'}`
        }

        let showSwitchpage = {
            display: `${this.state.showSwitchpage ? 'block' : 'none'}`,
            position: 'absolute',
            left: '400px',
            bottom: '40px',
            'zIndex': '3'
        }

        let c3 = {
            position: 'absolute', top: '30px', left: '20px', 'zIndex': '3'
        }

        return (<div id="whiteboardBox" className="whiteboardBox">
            <CoursewareBox state={this.state.showCourseware} />
            <SketchpadBox state={this.state.showSketchpad} />
            <Test handleClick={this.handleClick} />
            {/* <div id="sketchpadTools" className="sketchpadTools" style={showBrush}>
                <ul id="tools" className="tools"></ul>
            </div> */}

            {/* <div draggable="true" className={`dragBox ${this.state.showBrush ? 'showBrush' : ''}`} style={this.state.style} onDrag={this.handleDrag} onDragStart={this.handleDragStart} onDragOver={this.handleDragOver} onDragEnd={this.handleDragEnd} onDrop={this.handleDrop} onDragEnter={this.handleDragEnter} onDragLeave={this.handleDragLeave}>
                {items}
            </div> */}
            <div style={showSwitchpage}>
                <button onClick={this.jumpPage.bind(this, -1)}>上一页</button>
                <button onClick={this.jumpPage.bind(this, 1)}>下一页</button>
            </div>

            <div style={c3}>
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
