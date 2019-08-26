/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-10 11:47:38
 * @LastEditTime: 2019-08-26 14:07:19
 * @LastEditors: Please set LastEditors
 */
import GLB from './configs/GLB';

// 接受信令消息
const listenSignalMessage = function (type, message) {
    
    // 接受点对点传输来的数据
    const onMessageInstantReceive = function (message) {
        let data = JSON.parse(message.msg);
        if (data['syncCacheEnd']) {
            let handleData = [].concat.apply([], this.syncCacheData);
            handleData.forEach(element => {
                this.handleMessage(JSON.stringify(element));
            });
            this.syncCacheData = [];
        } else {
            this.syncCacheData[data['key']] = data['value'];
        }
    }.bind(this);

    // 频道有人加入时，点对点传输数据
    const onChannelUserJoined = function (message) {
        let that = this;
        this.getCurPageCache(function (msg) {
            that.peerToPeer(message.account, msg);
        });
    }.bind(this);

    // 接受频道广播消息
    const onMessageChannelReceive = function (message) {
        this.handleMessage(message);
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

const handleMessage = function (message, boolean) {
    if (typeof message !== 'string') return console.log('接受信令的消息应为string');
    let data = JSON.parse(message);
    // 自己广播的信令，自己不执行
    if (data.account === GLB.account && !boolean) return;
    // 外壳与白板通信
    if (data.sigType) {

        switch (data.sigType) {
            /***画板操作****/
            case 'showBrush':
                // 画板显示与隐藏（授权）
                let uid = data.sigUid + 'A';
                if (GLB.account == uid && GLB.role == '2') {
                    let brushCopy = JSON.stringify(this.state.brush);
                    let newBrush = JSON.parse(brushCopy);
                    newBrush.show = data.sigValue.value ? true : false;
                    this.setState({
                        brush: newBrush
                    })
                }
                break;
            /****展示课件*****/
            case 'showCourseware':
                this.setState({
                    course: {
                        show: data.sigValue.value ? true : false,
                        link: data.sigValue.value ? data.sigValue.link : ''
                    }
                })
                break;
        }
    }

    if (data.belong) {
        switch (data.belong) {
            // 白板与白板通信
            case 'whiteboard':
                // 显示或者隐藏画布
                // 画笔切换
                this[data.method](data.pars, true);
                break;
            // 白板与画板通信
            case 'sketchpad':
                // 画板绘画操作
                this.sketchpad[data.method](data.pars, true);
                break;
            // 白板与课件通信
            case 'courseware':
                this[data.method](data.pars.state);
                break;
        }
    }
};
export {
    listenPostMessage,
    listenSignalMessage,
    handleMessage
}
