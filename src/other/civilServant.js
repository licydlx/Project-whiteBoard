/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-10 11:47:38
 * @LastEditTime: 2019-08-22 20:49:21
 * @LastEditors: Please set LastEditors
 */
import GLB from './configs/GLB';
// 白板跳到某页
const jumpPage = function (newSwithPage, boolean) {
    let data = {
        state: newSwithPage,
        handleData: {
            method: 'swithScene',
            pars: newSwithPage.currentPage
        }
    }
    if (boolean) this.broadcastMessage('courseware', 'jumpPage', null, data);
    // 课件iframe
    let coursewareIframe = document.getElementById("coursewareIframe").contentWindow;
    this.message.sendMessage('child', data, coursewareIframe);

    // let brushCopy = JSON.stringify(this.state.brush);
    // let newBrush = JSON.parse(brushCopy);
    // newBrush.sketchpad.type = 'sketchpad';

    this.setState({
        switchPage: newSwithPage
    },() => {
        // 页面切换时，根据对应页面缓存改变状态
        let newPageNum = newSwithPage.currentPage;
        if (GLB.role == 0) {
            // 清空画板
            this.sketchpad.removeAll();
            let clearAll = {
                account:GLB.account,                 
                belong: "sketchpad",
                context: null,
                method: "removeAll",
                pars:null
            }
            this.engine.channel.messageChannelSend(JSON.stringify(clearAll));
            
            // 
            let curPage = 'page' + newPageNum;
            this.localforage.getItem(curPage, function (err, value) {
                if (Array.isArray(value) && value.length > 0) {
                    let seq;
                    value.forEach((message,index) => {
                        if (Object.is(message.belong, 'whiteboard')) seq = index;
                        if (Object.is(message.belong, 'sketchpad')) {
                            this.handleMessage(JSON.stringify(message), true);
                            this.engine.channel.messageChannelSend(JSON.stringify(message));
                       };
                    });
                    if(seq){
                        this.handleMessage(JSON.stringify(value[seq]), true);
                        this.engine.channel.messageChannelSend(JSON.stringify(value[seq]));
                    }
                }
            }.bind(this));
        }
    })
}

export {
    jumpPage
}