/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 17:44:09
 * @LastEditTime: 2019-08-14 18:51:30
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

window.drawConfig = {
    penShape: "",
    penColor: "#fff",
    penSize: "2",
    textSize: "14"
}

let mouseFrom = {},
    mouseTo = {},
    // 当前绘制对象
    drawingObject = null,
    // 绘制移动计数器
    moveCount = 1,
    // 绘制状态
    doDrawing = false,
    textContent = "",
    textInput = null;

const sketchpadEngine = function (domName) {
    let canvas = new fabric.Canvas(domName, {
        isDrawingMode: true,
        skipTargetFind: true,
        selectable: false,
        selection: false
    });

    window.canvas = canvas;
    window.zoom = window.zoom ? window.zoom : 1;

    canvas.freeDrawingBrush.color = window.drawConfig.penColor; //设置自由绘颜色
    canvas.freeDrawingBrush.width = window.drawConfig.penSize;

    // 绑定画板事件
    canvas.on("mouse:down", function (options) {
        console.log("mouse:down");
        let xy = transformMouse(options.e.offsetX, options.e.offsetY);
        mouseFrom.x = xy.x;
        mouseFrom.y = xy.y;
        doDrawing = true;

        // 如果为文本编辑状态，则退出
        if (textInput) {
            textInput.exitEditing();
            textInput = null;
        }

        // 如果画笔为text,则绘制
        if (Object.is(window.drawConfig.penShape, 'text')) {
            drawing();
        }
    });

    canvas.on("mouse:move", function (options) {
        console.log("mouse:move");
        // 减少绘制频率
        if (moveCount % 2 && !doDrawing) {
            return;
        }
        moveCount++;
        let xy = transformMouse(options.e.offsetX, options.e.offsetY);
        mouseTo.x = xy.x;
        mouseTo.y = xy.y;

        // 如果画笔为text,则不绘制
        if (!Object.is(window.drawConfig.penShape, 'text')) {
            drawing();
        }

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

    // canvas.on("object:modified", function (e) {
    //     console.log('object:modified')
    //     if (window.drawConfig.penShape === "text") {
    //         textContent = e.target.text;
    //         drawing();
    //     }
    // });

    canvas.on("selection:created", function (e) {
        console.log('selection:created')
        if (e.target._objects) {
          //多选删除
          let etCount = e.target._objects.length;
          for (let etindex = 0; etindex < etCount; etindex++) {
            canvas.remove(e.target._objects[etindex]);
          }
        } else {
          //单选删除
          canvas.remove(e.target);
        }
        canvas.discardActiveObject(); //清楚选中框
    });

}

const transformMouse = (mouseX, mouseY) => {
    return { x: mouseX / window.zoom, y: mouseY / window.zoom };
}

// 绘制
const drawing = () => {
    if (!window.drawConfig.penShape) return;
    if (drawingObject) canvas.remove(drawingObject);
    let curDrawing = null;
    switch (window.drawConfig.penShape) {
        case "line":
            // 直线
            curDrawing = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
                stroke: window.drawConfig.penColor,
                strokeWidth: window.drawConfig.penSize,
                fill: '#fff',
                originX: 'center',
                originY: 'center'
            });
            break;
        case "text":
            // 文本
            textInput = new fabric.Textbox(textContent, {
                left: mouseFrom.x,
                top: mouseFrom.y,
                width: 150,
                fontSize: window.drawConfig.textSize,
                fill: window.drawConfig.penColor,
                hasControls: false
            });

            canvas.add(textInput);
            textInput.enterEditing();
            textInput.hiddenTextarea.focus();
            textContent = "";
            break;
        case "ellipse":
            // 椭圆
            curDrawing = new fabric.Ellipse({
                stroke: window.drawConfig.penColor,
                strokeWidth: window.drawConfig.penSize,
                originX: "left",
                originY: "top",
                left: mouseFrom.x,
                top: mouseFrom.y,
                rx: Math.abs(mouseFrom.x - mouseTo.x),
                ry: Math.abs(mouseFrom.y - mouseTo.y),
                fill: "rgba(255,255,255,0)",
            });
            break;

        case "rectangle":
            // 长方形
            let path =
                "M " +
                mouseFrom.x +
                " " +
                mouseFrom.y +
                " L " +
                mouseTo.x +
                " " +
                mouseFrom.y +
                " L " +
                mouseTo.x +
                " " +
                mouseTo.y +
                " L " +
                mouseFrom.x +
                " " +
                mouseTo.y +
                " L " +
                mouseFrom.x +
                " " +
                mouseFrom.y +
                " z";
            curDrawing = new fabric.Path(path, {
                left: mouseFrom.x,
                top: mouseFrom.y,
                stroke: window.drawConfig.penColor,
                strokeWidth: window.drawConfig.penSize,
                fill: "rgba(255,255,255,0)",
            });
            break;
        case "eraser":
            break;

    }

    if (curDrawing) {
        canvas.add(curDrawing);
        drawingObject = curDrawing;
    }
}

export default sketchpadEngine;