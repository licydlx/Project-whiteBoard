/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 17:44:09
 * @LastEditTime: 2019-08-13 16:12:20
 * @LastEditors: Please set LastEditors
 */

// class sketchpadEngine {
//     constructor(domName,callback) {
//         this.callback = callback;
//         // 绘图要素配置

//         this.penShape = 'line';
//         this.penColor = '#E34F51';
//         this.penSize = '2';
//         this.mouseFrom = {};
//         this.mouseTo = {};

//         // 当前绘制对象
//         this.drawingObject = null;
//         // 绘制移动计数器
//         this.moveCount = 1;
//         // 绘制状态
//         this.doDrawing = false;

//         let canvas = new fabric.Canvas(domName, {
//             isDrawingMode: false,
//             skipTargetFind: true,
//             selectable: false,
//             selection: false
//         });

//         window.canvas = canvas;
//         window.zoom = window.zoom ? window.zoom : 1;
      
//         // 绑定画板事件
//         canvas.on("mouse:down", function (options) {
//             console.log("mouse:down");
//             let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
//             this.mouseFrom.x = xy.x;
//             this.mouseFrom.y = xy.y;
//             this.doDrawing = true;
//         }.bind(this));

//         canvas.on("mouse:move", function (options) {
//             console.log("mouse:move");
//             // 减少绘制频率
//             if (this.moveCount % 2 && !this.doDrawing){
//                 return;
//             }
//             this.moveCount++;
//             let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
//             this.mouseTo.x = xy.x;
//             this.mouseTo.y = xy.y;

//             this.drawing();
//         }.bind(this));

//         canvas.on("mouse:up", function (options) {
//             console.log('mouse:up')
//             let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
//             this.mouseTo.x = xy.x;
//             this.mouseTo.y = xy.y;
            
//             this.drawingObject = null;
//             this.doDrawing = false;
//             this.moveCount = 1;
//         }.bind(this));
//     }
//     // 坐标转换
//     transformMouse(mouseX, mouseY) {
//         return { x: mouseX / window.zoom, y: mouseY / window.zoom };
//     }

//     // 绘制
//     drawing() {
//         if (this.drawingObject) canvas.remove(this.drawingObject);
//         let curDrawing = null;
//         switch (this.penShape) {
//             case "line":
//                 // 直线
//                 curDrawing = new fabric.Line([this.mouseFrom.x, this.mouseFrom.y, this.mouseTo.x, this.mouseTo.y,30,30], {
//                     stroke: this.penColor,
//                     strokeWidth: this.penSize,
//                 });
//                 break;
//         }

//         if (curDrawing) {
//             canvas.add(curDrawing);
//             this.drawingObject = curDrawing;
//         }
//     }
// }
// export default sketchpadEngine;
let penShape = 'line',
penColor = '#E34F51',
penSize = '2',
mouseFrom = {},
mouseTo = {},
// 当前绘制对象
drawingObject = null,
// 绘制移动计数器
moveCount = 1,
// 绘制状态
doDrawing = false;


const sketchpadEngine = function(domName) {
    let canvas = new fabric.Canvas(domName, {
        isDrawingMode: false,
        skipTargetFind: true,
        selectable: false,
        selection: false
    });

    window.canvas = canvas;
    window.zoom = window.zoom ? window.zoom : 1;

    // 绑定画板事件
    canvas.on("mouse:down", function (options) {
        console.log("mouse:down");
        let xy = transformMouse(options.e.offsetX, options.e.offsetY);
        mouseFrom.x = xy.x;
        mouseFrom.y = xy.y;
        doDrawing = true;
    });

    canvas.on("mouse:move", function (options) {
        console.log("mouse:move");
        // 减少绘制频率
        if (moveCount % 2 && !doDrawing){
            return;
        }
        moveCount++;
        let xy = transformMouse(options.e.offsetX, options.e.offsetY);
        mouseTo.x = xy.x;
        mouseTo.y = xy.y;

        drawing();
    });

    canvas.on("mouse:up", function (options) {
        console.log('mouse:up')
        let xy = transformMouse(options.e.offsetX, options.e.offsetY);
        mouseTo.x = xy.x;
        mouseTo.y = xy.y;
        
        drawingObject = null;
        doDrawing = false;
        moveCount = 1;
    });
}

const transformMouse = (mouseX, mouseY) => {
    return { x: mouseX / window.zoom, y: mouseY / window.zoom };
}

    // 绘制
const drawing = () => {
    if (drawingObject) canvas.remove(drawingObject);
    let curDrawing = null;
    switch (penShape) {
        case "line":
            // 直线
            curDrawing = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y,30,30], {
                stroke: penColor,
                strokeWidth: penSize,
            });
            break;
    }
    
    if (curDrawing) {
        canvas.add(curDrawing);
        drawingObject = curDrawing;
    }
}

export default sketchpadEngine;