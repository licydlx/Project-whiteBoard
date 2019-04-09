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

class App extends Component {
    constructor() {
        super();
        this.state = {
            isShow: true,
            sub: 0,
            account: '',
            channel: '',
            showBrush:false,
            showCourseware:{
                value:true,
                link:''
            }
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
            account: account
        }
        signalEngine(data, function (engine) {
            this.engine = engine;

            this.setState({
                account: GLB.account,
                channel: GLB.channel
            })
            // 接入声网信令sdk对应的回调 
            signalResponse(this.engine, this.distributeInformation.bind(this));
        }.bind(this));
    }

    // 新用户注册，加入频道
    loginChannel(data) {
        let config = {
            role: data.role,
            account: data.uid,
            channel: data.channel,
            canDraw: data.canDraw
        }
        signalEngine(config, function (engine) {
            this.engine = engine;

            this.setState({
                account: GLB.account,
                channel: GLB.channel
            })
            
            // 接入声网信令sdk对应的回调 
            signalResponse(this.engine, this.distributeInformation.bind(this));
        }.bind(this));
    }

    // 白板监听message
    monitorParentMessage(e) {
        if (window === window.parent) return;
        if (typeof e.data !== 'string') return;
        let data = JSON.parse(e.data);
        this.distributeInformation(data);
    }

    // 白板分发message
    distributeInformation(data) {
        if (data.uid && data.channel) {
            // 请求用户及房间信息
            console.log('请求用户及房间信息');
            console.log(data);
            this.loginChannel(data);
        }
        if (data.sigType) {
            switch (data.sigType) {
                /***白板操作****/
                case 'showBrush':
                    console.log('白板操作');
                    console.log(data);

                    break;
                /****展示课件*****/
                case 'showCourseware':
                    console.log('展示课件');
                    console.log(data);
                    break;
            }
        }6

        if (data.belong) {
            switch (data.belong) {
                // 白板
                case 'whiteboard':
                    // 过滤向自己广播的消息
                    if (data.account && data.account !== this.engine.session.account) {
                        // 画板通信操作
                        if (data.type === 'sketchpadState') this[data.method](null, true);
                        // 画笔切换
                        if (data.type === 'sketchpadModal') {
                            let sub = parseInt(data.pars);
                            this[data.method](sub);
                        }

                        // 画板绘画操作
                        if (data.type === 'sketchpad' && this.sketchpad) {
                            let options = data.pars;
                            // 自由绘制
                            if (data.method === 'pathCreated') this.sketchpad[data.method](options);

                            if (data.method === 'removeBlock') {
                                let unRemovedSub = JSON.parse(options);
                                let total = this.sketchpad.canvas._objects;
                                this.sketchpad.canvas._objects = [];
                                if (unRemovedSub.length == 0) {
                                    this.sketchpad.canvas.add();
                                }
                                for (let x = 0; x < unRemovedSub.length; x++) {
                                    this.sketchpad.canvas.add(total[parseInt(unRemovedSub[x])]);
                                }
                            }

                            if (data.method === 'drawing') {
                                if (data.event === 'mouseDown') {
                                    this.sketchpad.doDrawing = true;
                                }

                                if (data.event === 'mouseUp') {
                                    this.sketchpad.drawingObject = null;
                                    this.sketchpad.doDrawing = false;
                                    this.sketchpad.moveCount = 1;
                                    this.sketchpad.doDrawing = false;
                                }

                                if (options) {
                                    this.sketchpad[data.method](options);
                                }
                            }
                        }
                    }
                    break;
                // 课件
                case 'courseware':
                    // 白板向子级窗口传递message
                    this.coursewareIframe.postMessage(JSON.stringify(data), '*');
                    break;
            }
        }
    }

    // 显示或者隐藏
    showOrHide(e, bcm) {
        if (e) e.preventDefault();
        this.state.isShow ? this.setState({ isShow: false }) : this.setState({ isShow: true })
        // 
        if (!bcm) this.broadcastMessage('whiteboard', 'sketchpadState', 'showOrHide', null);
    }

    // 白板跳到某页
    jumpPage(pageNum, e) {
        e.preventDefault();
        let data = {
            belong: 'courseware',
            type: 'agoraAdyJumpPage',
            pageNum: pageNum
        }

        this.coursewareIframe.postMessage(JSON.stringify(data), '*');
        this.engine.channel.messageChannelSend(data);
    }

    // 广播message
    broadcastMessage(belong, type, method, pars, event) {
        let data = {
            belong: belong,
            type: type,
            method: method,
            pars: pars,
            event: event
        }
        this.engine.channel.messageChannelSend(data);
    }

    // 组件已经被渲染到页面中后触发：此时页面中有了真正的DOM的元素，可以进行DOM相关的操作
    componentDidMount() {
        let that = this;
        // 监听父级message
        window.addEventListener("message", this.monitorParentMessage.bind(this), false);
        // 获取课件iframeDom
        this.coursewareIframe = document.getElementById("coursewareIframe").contentWindow;
        // 画板实例化
        this.sketchpad = new sketchpadEngine(function (method, options, event) {
            that.broadcastMessage('whiteboard', 'sketchpad', method, options, event)
        });

        // 申请登录及加入频道
        if (window !== window.parent) {
            window.parent.postMessage('readyForChannel', '*');
        }
    }

    componentWillUnmount() {
        // 移除监听
        window.removeEventListener("message", this.monitorParentMessage.bind(this));
        
        // 推出频道 
        this.engine.session.logout();
    }

    handleClick(sub, e) {
        if (e) e.preventDefault();

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

        if (e) this.broadcastMessage('whiteboard', 'sketchpadModal', 'handleClick', sub)
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
            position: 'absolute', bottom: '20px', left: '20px','zIndex':'3'
        }

        let c2 = {
            position: 'absolute', bottom: '50px', left: '20px','zIndex':'3'
        }

        let c3 = {
            position: 'absolute', top: '30px', left: '20px','zIndex':'3'
        }

        return (<div>
            <div id="coursewareBox">
                <iframe id="coursewareIframe" title="课件iframe" name="coursewareIframe" allow="autoplay" frameBorder="0" scrolling="no" width="960px" height="540px" className={"width: 100%; height: 100%; border: none; padding: 0px; margin: 0px;"} src="https://www.kunqu.tech/page1/">
                    <p>Your browser does not support iframes.</p>
                </iframe>
            </div>
            <SketchpadBox state={this.state.isShow} />
            <div id="sketchpadTools" className="sketchpadTools">
                <ul id="tools" className="tools">{items}</ul>
            </div>

            <div style={c1}>
                <button onClick={this.jumpPage.bind(this, 1)}>上一页</button>
                <button onClick={this.jumpPage.bind(this, 2)}>下一页</button>
            </div>
            <div style={c2}>
                <button onClick={this.showOrHide.bind(this)}>显示或隐藏</button>
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
