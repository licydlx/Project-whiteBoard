/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-10 11:47:38
 * @LastEditTime: 2019-08-16 11:02:38
 * @LastEditors: Please set LastEditors
 */
import visualArea from './visualArea';

let { windowWidth, windowHeight } = { ...visualArea() };
// ====================
// 随意缩放导致画板出现bug，需重新实例化
// ====================
const compar169 = () => {
    let width = 0,
        height = 0;
    let rate = windowWidth / windowHeight;
    
    if (rate > 16 / 9) {
        width = windowHeight * 16 / 9 + 'px';
        height = windowHeight + 'px';
    } else {
        width = windowWidth + 'px';
        height = windowWidth * 9 / 16 + 'px';
    }

    return {
        width:width,
        height:height,
    }
}

export default compar169;