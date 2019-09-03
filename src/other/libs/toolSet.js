/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-10 11:47:38
 * @LastEditTime: 2019-08-30 14:51:23
 * @LastEditors: Please set LastEditors
 */
// ====================
// 随意缩放导致画板出现bug，需重新实例化
// ====================
const findDimensions = function () {
    console.log('findDimensions');
    let winWidth = 0;
    let winHeight = 0;
    //函数：获取尺寸
    //获取窗口宽度
    if (window.innerWidth) {
        winWidth = window.innerWidth;
    } else if ((document.body) && (document.body.clientWidth)) {
        winWidth = document.body.clientWidth;
    }
    //获取窗口高度
    if (window.innerHeight) {
        winHeight = window.innerHeight;
    } else if ((document.body) && (document.body.clientHeight)) {
        winHeight = document.body.clientHeight;
    }

    let whiteboardBox = document.getElementById('whiteboardBox');
    let sketchpad = document.getElementById('sketchpad');
    let rate = winWidth / winHeight;

    if (rate > 16 / 9) {
        whiteboardBox.style.width = winHeight * 16 / 9 + 'px';
        whiteboardBox.style.height = winHeight + 'px';
        
        sketchpad.width = winHeight * 16 / 9;
        sketchpad.height = winHeight;
    } else {
        whiteboardBox.style.width = winWidth + 'px';
        whiteboardBox.style.height = winWidth * 9 / 16 + 'px';
        sketchpad.width = winWidth;
        sketchpad.height = winWidth * 9 / 16;
    }
}

export {
    findDimensions
}