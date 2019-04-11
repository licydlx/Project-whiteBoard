import React, { Component } from 'react';
import fabric from 'fabric';
import GLB from './configs/GLB';

import SketchpadBox from './ui/SketchpadBox';
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
        this.state = {
            sub: 0,
            account: '',
            channel: '',

            isShow: false,
            showBrush: false,
            showCourseware: true,
            coursewareLink: '',

            test1:'',
            test2:''
        }
        this.tools = [
            {
                'data-type': 'pen',
                'className': 'icon-pen-select',
                'data-default': 'icon-pen-black',
                'state': false
            },
            {
                'data-type': 'arrow',
                'className': 'icon-arrow-black',
                'data-default': 'icon-arrow-black',
                'state': false
            },
            {
                'data-type': 'line',
                'className': 'icon-line-black',
                'data-default': 'icon-line-black',
                'state': false
            },
            {
                'data-type': 'ellipse',
                'className': 'icon-ellipse-black',
                'data-default': 'icon-ellipse-black',
                'state': false
            }, {
                'data-type': 'rectangle',
                'className': 'icon-rectangle-black',
                'data-default': 'icon-rectangle-black',
                'state': false
            },
            {
                'data-type': 'text',
                'className': 'icon-text-black',
                'data-default': 'icon-text-black',
                'state': false
            }, {
                'data-type': 'remove',
                'className': 'icon-remove-black',
                'data-default': 'icon-remove-black',
                'state': false
            }
        ]

        let account = Math.floor(Math.random() * 100);
        let data = {
            role: 0,
            uid: account,
            channel: 'test1',
            canDraw: true
        }
        this.loginChannel(data);
    }

    componentDidMount() {
        // 课件iframe
        this.coursewareIframe = document.getElementById("coursewareIframe").contentWindow;
        // message监听
        this.message = new messageEngine(this.listenPostMessage.bind(this));
        
        console.log(this.message);
        this.message.listen();
        // 画板实例化
        this.sketchpad = new sketchpadEngine(function (method, context, pars) {
            this.broadcastMessage('sketchpad', method, context, pars);
        }.bind(this));

        // DOM加载完毕，请求用户信息及登录
        this.message.sendMessage('father', 'readyForChannel', '*');

        console.log('==============加载完成通知IOS===================');
        if(window.webkit){
            window.webkit.messageHandlers.readyForChannel.postMessage('readyForChannel');

            window.receiveResourceInfoFun = function(data){
                console.log('==========receiveResourceInfoFun===============');
                this.setState({
                    test1: data
                })

                if(!GLB.logined){
                    if(typeof data == 'string') data = JSON.parse(data);
                    this.loginChannel(data);
                }
            }.bind(this);
        }
    }

    componentWillUnmount() {
        this.message.remove();
        // 推出频道 
        this.engine.session.logout();
    }

    // // 新用户注册，加入频道 来自IOS
    // receiveResourceInfoFun(data){
    //     console.log('==========receiveResourceInfoFun===============');
    //     console.log(data);
    //     if(!GLB.logined){
    //         if(typeof data == 'string') data = JSON.parse(data);
    //         this.loginChannel(data);
    //     }

    // }
    // 新用户注册，加入频道
    loginChannel(data) {
        
        // 
        signalEngine(data, function (engine) {
            this.engine = engine;

            this.setState({
                account: GLB.account,
                channel: GLB.channel,
                showBrush: GLB.canDraw
            })

            GLB.logined = true;
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
        if(!this.engine) console.log('请先登录及加入频道！');
        this.engine.channel.messageChannelSend(JSON.stringify(data));
    }

    // 接受信令消息
    listenSignalMessage(config) {
        if (typeof config !== 'string') return console.log('接受信令的消息应为string');
        let data = JSON.parse(config);

        console.log(data);
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
                            showBrush: data.sigValue.value ? true : false
                        })
                    }
                    break;
                /****展示课件*****/
                case 'showCourseware':
                    console.log('展示课件');
                    console.log(data);
                    this.setState({
                        showCourseware: data.sigValue.value ? true : false,
                        coursewareLink: data.sigValue.value ? data.sigValue.link : ''
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
                    console.log('courseware');
                    // 白板向子级窗口传递message
                    this.message.sendMessage('child', data.pars, this.coursewareIframe)
                    break;
            }
        }

    }

    // 接受postmessage消息
    listenPostMessage(e) {
        console.log('接受postmessage消息')
        console.log(e)
        if (!GLB.logined && e == 'string') this.loginChannel(JSON.parse(e));
        if (window === window.parent) return;
        if (typeof e.data !== 'string') return;
        if(!this.engine) console.log('请先登录及加入频道！');
        let data = JSON.parse(e.data);
        this.broadcastMessage('courseware', null, null, JSON.stringify(data));
    };

    // 白板跳到某页
    jumpPage(pageNum, e) {
        if (e) e.preventDefault();
        let data = {
            belong: 'courseware',
            type: 'agoraAdyJumpPage',
            pageNum: pageNum
        }
        this.message.sendMessage('child', data, this.coursewareIframe);
        this.broadcastMessage('courseware', null, null, JSON.stringify(data));
    }

    // 显示或者隐藏
    showOrHide(boolean, e) {
        if (e) e.preventDefault();
        this.setState({ isShow: this.state.isShow ? false : true })
        if (e) this.broadcastMessage('whiteboard', 'showOrHide');
    }

    handleClick(sub, e) {
        if (e) e.preventDefault();
        if (typeof sub == 'string') sub = JSON.parse(sub);
        if (this.sketchpad.textbox) {
            // 退出文本编辑状态
            this.sketchpad.textbox.exitEditing();
            this.sketchpad.textbox = null;
        }
        let newTools = this.tools.map(function (value, index) {
            if (sub === index) {
                value.state = true;
                let type = value['data-type'];
                this.sketchpad.drawType = type;
                this.sketchpad.canvas.isDrawingMode = false;

                if (type == 'remove') {
                    this.sketchpad.canvas.selection = true;
                    this.sketchpad.canvas.skipTargetFind = false;
                    this.sketchpad.canvas.selectable = true;
                } else if (type == 'pen') {
                    this.sketchpad.canvas.isDrawingMode = true;
                } else {
                    // 画板元素不能被选中
                    this.sketchpad.canvas.skipTargetFind = true;
                    // 画板不显示选中
                    this.sketchpad.canvas.selection = false;
                }
            } else {
                value.state = false;
            }
        }.bind(this));
        this.setState({ tools: newTools });
        if (e) this.broadcastMessage('whiteboard', 'handleClick', null, JSON.stringify(sub));
    }

    render() {
        let sub = this.state.sub;
        this.tools[sub]['state'] = true;

        const items = this.tools.map((value, index) =>
            <li data-type={value['data-type']} key={index} className={value['state'] ? 'active' : ''} onClick={this.handleClick.bind(this, index)}>
                <i className={`icon-tools ${value['className']}`} data-default={`icon-tools ${value['data-default']}`}></i>
            </li>
        );

        let c1 = {
            position: 'absolute', bottom: '20px', left: '500px', 'zIndex': '3'
        }

        let c2 = {
            position: 'absolute', bottom: '50px', left: '20px', 'zIndex': '3'
        }

        let c3 = {
            position: 'absolute', top: '30px', left: '20px', 'zIndex': '3'
        }

        let c4 = {
            display: `${this.state.showBrush ? 'block' : 'none'}`
        };

        let c5 = {
            display: `${this.state.showCourseware ? 'block' : 'none'}`
        };

        return (<div id="whiteboardBox" className="whiteboardBox">
            <div id="coursewareBox" className="coursewareBox">
                <iframe style={c5} id="coursewareIframe" title="课件iframe" name="coursewareIframe" allow="autoplay" frameBorder="0" scrolling="no" width="960px" height="540px" className={"width: 100%; height: 100%; border: none; padding: 0px; margin: 0px;"} src="https://www.kunqu.tech/page1/">
                    <p>Your browser does not support iframes.</p>
                </iframe>
            </div>
            <SketchpadBox state={this.state.isShow} />
            <div style={c4}>
                <div id="sketchpadTools" className="sketchpadTools">
                    <ul id="tools" className="tools">{items}</ul>
                </div>
                <div style={c2}>
                    <button onClick={this.showOrHide.bind(this, false)}>显示或隐藏</button>
                </div>
            </div>

            <div style={c1}>
                <button onClick={this.jumpPage.bind(this, 1)}>上一页</button>
                <button onClick={this.jumpPage.bind(this, 2)}>下一页</button>
            </div>
        
            <div style={c3}>
                <p>{this.state.test1}</p>
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
