import React, { Component } from 'react';
import fabric from 'fabric';
import sketchpadEngine from './libs/sketchpadEngine';

import SketchpadBox from './ui/SketchpadBox';

import signalEngine from './libs/signalEngine';
import signalResponse from './libs/signalResponse';

class App extends Component {
    constructor() {
        super();

        this.state = {
            isShow: false
        }

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
        console.log('白板收到message:');
        if (window === window.parent) return;
        if (typeof e.data !== 'string') return;
        console.log('白板执行message分发！');
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
                    
                    if (data.type === 'sketchpad' && window.sketchpad) {
                       console.log(data);
                       // console.log(window.sketchpad);
                        
                        let options = data.pars;
                        console.log(typeof options);
                        console.log(options);

                        if(data.method === 'mouseDown'){
                            let xy = window.sketchpad.__proto__.transformMouse(options.e.offsetX, options.e.offsetY);
                            window.sketchpad.__proto__.mouseFrom.x = xy.x;
                            window.sketchpad.__proto__.mouseFrom.y = xy.y;
                            window.sketchpad.__proto__.doDrawing = true;
                        }

                        if(data.method === 'mouseMove'){
                            if (window.sketchpad.__proto__.moveCount % 2 && !window.sketchpad.__proto__.doDrawing) {
                                // 减少绘制频率
                                return;
                            }
                            window.sketchpad.__proto__.moveCount++;
                            let xy = window.sketchpad.__proto__.transformMouse(options.e.offsetX, options.e.offsetY);
                            window.sketchpad.__proto__.mouseTo.x = xy.x;
                            window.sketchpad.__proto__.mouseTo.y = xy.y;
                            window.sketchpad.__proto__.drawing();
                        }

                        if(data.method === 'mouseUp'){
                            let xy = window.sketchpad.__proto__.transformMouse(options.e.offsetX, options.e.offsetY);
                            window.sketchpad.__proto__.mouseTo.x = xy.x;
                            window.sketchpad.__proto__.mouseTo.y = xy.y;
                    
                            window.sketchpad.__proto__.drawing();
                    
                            window.sketchpad.__proto__.drawingObject = null;
                            window.sketchpad.__proto__.moveCount = 1;
                            window.sketchpad.__proto__.doDrawing = false;
                        }
                    }


                    if(data.type === 'test'){
                        console.log(data);
                        console.log(window.sketchpad)
                        window.sketchpad['__proto__'][data.method](data.pars);
                        console.log(window.sketchpad)
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
    broadcastMessage(belong, type, method, pars) {
        let data = {
            belong: belong,
            type: type,
            method: method,
            pars: pars
        }
        this.engine.channel.messageChannelSend(data);
    }

    componentDidMount() {
        let that = this;

        // 监听父级message
        window.addEventListener("message", this.monitorParentMessage.bind(this), false);

        // 获取课件iframeDom
        this.coursewareIframe = document.getElementById("coursewareIframe").contentWindow;

        window.sketchpad = new sketchpadEngine(function (options,method) {
            //that.broadcastMessage('whiteboard', 'sketchpad', method, options)

            that.broadcastMessage('whiteboard', 'test', method, options);
        });
        // this.sketchpad['__proto__']['mouseDown']();
       // console.log(window.sketchpad);
        
    }

    componentWillUnmount() {
        // 移除监听
        window.removeEventListener("message", this.monitorParentMessage.bind(this));
    }

    render() {
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
                <ul id="tools" className="tools">
                    <li id="toolsPencil" data-type="pen" className="active">
                        <i className="icon-tools icon-pen-select" data-default='icon-tools icon-pen-black'></i>
                    </li>
                    <li data-type="arrow">
                        <i className="icon-tools icon-arrow-black" data-default='icon-tools icon-arrow-black'></i>
                    </li>
                    <li data-type="line">
                        <i className="icon-tools icon-line-black" data-default='icon-tools icon-line-black'></i>
                    </li>
                    <li data-type="dottedline">
                        <i className="icon-tools icon-dottedline-black" data-default='icon-tools icon-dottedline-black'></i>
                    </li>
                    <li data-type="circle">
                        <i className="icon-tools icon-circle-black" data-default='icon-tools icon-circle-black'></i>
                    </li>
                    <li data-type="ellipse">
                        <i className="icon-tools icon-ellipse-black" data-default='icon-tools icon-ellipse-black'></i>
                    </li>
                    <li data-type="rectangle">
                        <i className="icon-tools icon-rectangle-black" data-default='icon-tools icon-rectangle-black'></i>
                    </li>
                    <li data-type="text">
                        <i className="icon-tools icon-text-black" data-default='icon-tools icon-text-black'></i>
                    </li>
                    <li data-type="remove">
                        <i className="icon-tools icon-remove-black" data-default='icon-tools icon-remove-black'></i>
                    </li>
                </ul>
            </div>

            <div id="test"></div>

        </div>
        );
    }
}

export default App;
