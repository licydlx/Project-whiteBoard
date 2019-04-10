class messageEngine {
    constructor(callback) {
        this.callback = callback;
    }

    listen() {
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