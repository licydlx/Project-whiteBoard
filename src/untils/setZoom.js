/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-23 13:32:00
 * @LastEditTime: 2019-08-30 14:49:56
 * @LastEditors: Please set LastEditors
 */
const setZoom = canvas => {
    // 任务
    // 对可视区，元素高宽等做些研究，归纳
    // 2019-08-14
    let zoom = 1;
    let whiteBoard = document.getElementById("whiteBoard");
    let eleWidth = whiteBoard.offsetWidth,
        eleHeight = whiteBoard.offsetHeight,
        cHeight = canvas.height,
        cWidth = canvas.width;
    let width = eleWidth > cWidth ? eleWidth : cWidth;
    let height = eleHeight > cHeight ? eleHeight : cHeight;
    if (width > height) {
        // 横版
        width = eleWidth;
        height = eleHeight;
        zoom = width / 960;
    } else {
        // 竖版
        height = height * eleHeight / 540 * 0.8;
        zoom = height / 540;
    }
    canvas.setZoom(zoom);
    canvas.setWidth(width);
    canvas.setHeight(height);
    window.zoom = zoom;
    canvas.renderAll();
}

export default setZoom;