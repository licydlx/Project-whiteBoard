import React, { Component } from 'react';
import fabric from 'fabric';
import sketchpad from './untils/sketchpad';

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

    // 广播message
    broadcastMessage(data) {
        this.engine.channel.messageChannelSend(data);
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
        if (data.towards === 'up') {

        } else {
            this.postChildMessage(data);
        }
    }
    
    // 白板向子级窗口传递message
    postChildMessage(data) {       
        let iframeWin = document.getElementById("coursewareIframe").contentWindow;     
        iframeWin.postMessage(JSON.stringify(data), '*');
    }

    // 显示或者隐藏
    showOrHide(e) {
        e.preventDefault();
        this.state.isShow ? this.setState({ isShow: false }) : this.setState({ isShow: true })
    }

    // 白板跳到某页
    jumpPage(pageNum, e) {
        e.preventDefault();
        let data = {
            type: 'agoraAdyJumpPage',
            pageNum: pageNum
        }

        this.broadcastMessage(data);
        this.postChildMessage(data);
    }

    componentDidMount() {
        // 监听父级message
        window.addEventListener("message", this.monitorParentMessage.bind(this), false);

        //sketchpad();

        function test(){
            console.log(this);
            this.a = '11';
        }

        test.prototype.h = function(){
            console.log('haha');
        };

        var b = new test();
        console.log(b);
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
                <button onClick={this.showOrHide.bind(this)}>显示</button>
                <button onClick={this.showOrHide.bind(this)}>隐藏</button>
            </div>

        </div>
        );
    }
}

export default App;
