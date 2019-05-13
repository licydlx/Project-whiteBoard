import GLB from './configs/GLB';

// 接受信令消息
const listenSignalMessage = function (type, message) {
    // 接受点对点传输来的数据
    const onMessageInstantReceive = function (message) {
        // let data = JSON.parse(message.msg);
        // if(data['syncCacheEnd']) {
        //     let handleData = [].concat.apply([],this.syncCacheData);
        //     handleData.forEach(element => {
        //         handleMessage(JSON.stringify(element));
        //     });
        //     this.syncCacheData = [];
        // } else {
        //     this.syncCacheData[data['key']] = data['value'];
        // }
    }.bind(this);

    // 频道有人加入时，点对点传输数据
    const onChannelUserJoined = function (message) {   
        // let that = this;
        // this.getCurPageCache(function(msg){
        //     that.peerToPeer(message.account, msg);
        // });
    }.bind(this);

    // 接受频道广播消息
    const onMessageChannelReceive = function (message) { 
        handleMessage(message);
    }.bind(this);

    const handleMessage = function (message) {
        console.log(message);
        if (typeof message !== 'string') return console.log('接受信令的消息应为string');
        let data = JSON.parse(message);
        // 自己广播的信令，自己不执行
        if (data.account === GLB.account) {
            // console.log(data);
            // switch (data.belong) {
            //     case 'cacheRender':
            //         for (let index = 0; index < data.pars.length; index++) {
            //             data.pars[index].account = null;
            //             handleMessage(JSON.stringify(data.pars[index]));
            //         }
            //         break;
            // }
            return;
        };
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
                // 本地数据库
                case 'dataBase':
                    // 配置不同的驱动优先级
                    this.localforage.config({
                        driver: [this.localforage.INDEXEDDB,
                        this.localforage.WEBSQL,
                        this.localforage.LOCALSTORAGE],
                        name: data.pars,
                        description: '白板缓存机制'
                    });

                    this.localforage.getItem('page1', function (err, value) {
                        if (value) return;
                        this.localforage.setItem('page1', []).then(function (value) {
                            console.log(value);
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }.bind(this));
                    break;
                // 白板与白板通信
                case 'whiteboard':
                    // 显示或者隐藏画布
                    // 画笔切换
                    this[data.method](data.pars, true);
                    break;

                // 白板与画板通信
                case 'sketchpad':
                    this.sketchpad[data.method](data.pars, true);

                    // 画板绘画操作
                    // if (data.method === 'removeBlock') {
                    //     let unRemovedSub = JSON.parse(data.pars);
                    //     let total = this.sketchpad.canvas._objects;
                    //     this.sketchpad.canvas._objects = [];
                    //     if (unRemovedSub.length == 0) {
                    //         this.sketchpad.canvas.add();
                    //     }
                    //     for (let x = 0; x < unRemovedSub.length; x++) {
                    //         this.sketchpad.canvas.add(total[parseInt(unRemovedSub[x])]);
                    //     }
                    //     return;
                    // }
                    // if (data.context === 'mouseDown') this.sketchpad.doDrawing = true;
                    // if (data.context === 'mouseUp') {
                    //     this.sketchpad.drawingObject = null;
                    //     this.sketchpad.doDrawing = false;
                    //     this.sketchpad.moveCount = 1;
                    // }
                    // if (data.method) this.sketchpad[data.method](data.context, data.pars);
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
        case 'onMessageInstantReceive':
            onMessageInstantReceive(message);
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
