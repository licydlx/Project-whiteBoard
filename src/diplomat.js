import GLB from './configs/GLB';

// 接受信令消息
const listenSignalMessage = function (type,message) {
    console.log('listenSignalMessage');

    const onChannelUserJoined = function(message){
        console.log('onChannelUserJoined');
        let that = this;
        let dataBase = this.localforage;
        dataBase.length().then(function(numberOfKeys) {
            dataBase.key(numberOfKeys - 1).then(function(keyName) {
                dataBase.getItem(keyName, function(err, value) {
                    console.log(value);
                    that.broadcastMessage('test', null, null, value);
                });
            })
        }).catch(function(err) {
            console.log(err);
        });
    }.bind(this);
    
    const onMessageChannelReceive = function(message) {
        if (typeof message !== 'string') return console.log('接受信令的消息应为string');
        let data = JSON.parse(message);
        // 自己广播的信令，自己不执行
        if (data.account === GLB.account) return;

        // 外壳与白板通信
        // if (data.sigType) {
        //     switch (data.sigType) {
        //         /***画板操作****/
        //         case 'showBrush':
        //             // 画板显示与隐藏（授权）
        //             let uid = data.sigUid + '123';
        //             if (GLB.account == uid && GLB.role == '2') {
    
        //                 this.setState({
        //                     brush: {
        //                         show: data.sigValue.value ? true : false
        //                     }
        //                 })
        //             }
        //             break;
        //         /****展示课件*****/
        //         case 'showCourseware':
        //             this.setState({
        //                 course: {
        //                     show: data.sigValue.value ? true : false,
        //                     link: data.sigValue.value ? data.sigValue.link : ''
        //                 }
        //             })
        //             break;
        //     }
        // }
        if (data.belong) {
            switch (data.belong) {
                case 'test':
                    this.setState(data.pars);
                    break;
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
                    }
                    if (data.method) this.sketchpad[data.method](data.context, data.pars);
                    break;
                // 白板与课件通信
                case 'courseware':
                    this[data.method](data.pars.state);
                    break;
            }
        }
    }.bind(this);

    switch (type) {
        case 'onChannelUserJoined':
            onChannelUserJoined(message);
            break;
        case 'onMessageChannelReceive':
            onMessageChannelReceive(message);
            break;
        default:
            break;
    }
}

// 接受postmessage消息
const listenPostMessage = function (e) {
    if (typeof e.data !== 'string' || e.data == '') return;
    let data = JSON.parse(e.data);
    // GLB.logined 是否已登录频道
    if (GLB.logined) {
        this.broadcastMessage('courseware', null, null, data);
    } else {
        if (data.uid && data.channel) this.loginChannel(data);
    }
};

export {
    listenPostMessage,
    listenSignalMessage,
}
