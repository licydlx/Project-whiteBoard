/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-10 11:47:38
 * @LastEditTime: 2019-09-17 17:31:23
 * @LastEditors: Please set LastEditors
 */
import visualArea from './visualArea';

let { windowWidth, windowHeight } = { ...visualArea() };
// ====================
// 随意缩放导致画板出现bug，需重新实例化
// ====================
const ratio = (percent) => {
    let width = 0,
        height = 0,
        rate = windowWidth / windowHeight;   
    if (rate > percent) {
        width = windowHeight * percent + 'px';
        height = windowHeight + 'px';
    } else {
        width = windowWidth + 'px';
        height = windowWidth * percent + 'px';
    }

    // 手机端横屏
    // if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
    //     // if (rate > 16 / 9) {
    //     //     width = windowHeight * 16 / 9 + 'px';
    //     //     height = windowHeight + 'px';
    //     // } else {
    //     //     width = windowWidth + 'px';
    //     //     height = windowWidth * 9 / 16 + 'px';
    //     // }
    //     // document.getElementsByTagName('body')[0].style.width = windowWidth + "px";
    //     // document.getElementsByTagName('body')[0].style.height = windowHeight + "px";
    //     // document.getElementsByTagName('body')[0].style.transform = 'rotate(90deg)';
    // } else {}

    return {
        width: width,
        height: height
    }
}

export default ratio;