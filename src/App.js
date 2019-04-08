import React, { Component } from 'react';
import fabric from 'fabric';
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
            sub: 0
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
        // 新用户注册，加入频道
        let account = Math.floor(Math.random() * 100);

        let data = {
            account: account
        }

        signalEngine(data, function (engine) {
            this.engine = engine;

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
        switch (data.belong) {
            // 白板
            case 'whiteboard':
                // 过滤向自己广播的消息
                if (data.account && data.account !== this.engine.session.account) {
                    // 画板通信操作
                    if (data.type === 'sketchpadState') {
                        this[data.method](null, true);
                    }

                    if (data.type === 'sketchpad' && this.sketchpad) {
                        let options = data.pars;

                        // 自由绘制
                        if (data.method === 'pathCreated') {
                            this.sketchpad[data.method](options);
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

    componentDidMount() {
        let that = this;
        // 监听父级message
        window.addEventListener("message", this.monitorParentMessage.bind(this), false);
        // 获取课件iframeDom
        this.coursewareIframe = document.getElementById("coursewareIframe").contentWindow;

        this.sketchpad = new sketchpadEngine(function (method, options, event) {
            that.broadcastMessage('whiteboard', 'sketchpad', method, options, event)
        });

        console.log(this.sketchpad);
    }

    componentWillUnmount() {
        // 移除监听
        window.removeEventListener("message", this.monitorParentMessage.bind(this));
    }

    handleClick(sub, e) {
        e.preventDefault();

        let newTools = this.tools.map(function (value, index) {
            if (sub === index) {
                value.state = true;
            } else {
                value.state = false;
            }
        })

        this.setState({ tools: newTools });
    }

    render() {

        let sub = this.state.sub;
        this.tools[sub]['state'] = true;

        console.log(this.tools);
        
        const items = this.tools.map((value, index) =>
            <li data-type={value['data-type']} key={index} className={value['state'] ? 'active' : ''} onClick={this.handleClick.bind(this, index)}>
                <i className={`icon-tools ${value['className']}`} data-default={`icon-tools ${value['data-default']}`}></i>
            </li>
        );

        return (<div>
            <div id="coursewareBox">
                <iframe id="coursewareIframe" title="课件iframe" name="coursewareIframe" allow="autoplay" frameBorder="0" scrolling="no" width="960px" height="540px" className={"width: 100%; height: 100%; border: none; padding: 0px; margin: 0px;"} src="https://www.kunqu.tech/page1/">
                    <p>Your browser does not support iframes.</p>
                </iframe>
            </div>
            <div>
                <button onClick={this.jumpPage.bind(this, 1)}>上一页</button>
                <button onClick={this.jumpPage.bind(this, 2)}>下一页</button>
            </div>

            <SketchpadBox state={this.state.isShow} />

            <div>
                <button onClick={this.showOrHide.bind(this)}>显示或隐藏</button>
            </div>

            <div id="sketchpadTools" className="sketchpadTools">
                <ul id="tools" className="tools">{items}</ul>
            </div>
        </div>
        );
    }
}

export default App;
