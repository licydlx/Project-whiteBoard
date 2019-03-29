
// =============
// 课件通信区
// =============
// 获取id为otherPage的iframe窗口对象        
var coursewareIframe = document.getElementById("coursewareIframe").contentWindow;

// 监听子级message
window.addEventListener("message", monitorMessage, false);

function monitorMessage(event) {
    console.log('监听message');
    if (window === window.parent) return;
    if (typeof event.data !== 'string') return;
    let data = JSON.parse(event.data);

    if (data.type) {
        console.log('监听父级message');
        coursewareIframe.postMessage(JSON.stringify(data), '*');
    } else {
        console.log('监听子级message');
        window.parent.postMessage(JSON.stringify(data), "*");
    }
}

// ios 通信适配
window.jsAPI = {};
window.jsAPI.pageControl = function (data) {
    console.log('调用方法成功！');
    if (typeof data !== 'string') {
        data = JSON.stringify(data);
    }
    coursewareIframe.postMessage(data, '*');
};

// =============
// 画板通信区
// =============

