/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 18:08:41
 * @LastEditTime: 2019-08-20 11:12:56
 * @LastEditors: Please set LastEditors
 */
class messageEngine {
    constructor(callback) {
        this.callback = callback;

        window.addEventListener("message", this.callback, false);
    }

    sendMessage(type, data, iframeContext) {
        if (type !== 'father' && type !== 'child') return console.log('请输入message传输类型');
        if (typeof data !== 'string') data = JSON.stringify(data);
        switch (type) {
            case 'father':
                if (window !== window.parent) window.parent.postMessage(data, '*');
                break;
            case 'child':
                if (iframeContext) iframeContext.postMessage(data, '*');
                break;
        }
    }

    remove() {
        window.removeEventListener("message", this.callback);
    }

}

export default messageEngine;