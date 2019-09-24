/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 17:44:09
 * @LastEditTime: 2019-09-24 17:20:11
 * @LastEditors: Please set LastEditors
 */

import { addPath, addText, addGraph, removeCreated } from '../../actions'

window.drawConfig = {
    penShape: "",
    penColor: "#fd2c0a",
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

let preMouseFrom = "";

const sketchpadEngine = function (domName, callback) {
    let canvas = new window.fabric.Canvas(domName, {
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
        // 如果为文本编辑状态，则退出
        if (textInput) {
            if(textInput.text){
                preMouseFrom = JSON.stringify(mouseFrom);
                if (callback){
                    callback({
                        action: addText({mouseFrom:JSON.parse(preMouseFrom), textContent:textInput.text})
                    })
                }
            }
            textInput.exitEditing();
            textInput = null;
        }
        
        let xy = transformMouse(options.pointer.x, options.pointer.y);
        mouseFrom.x = xy.x;
        mouseFrom.y = xy.y;
        doDrawing = true;

        // 如果画笔为text,则绘制
        if (Object.is(window.drawConfig.penShape, 'text')) {
            drawing();
        }
    });

    canvas.on("mouse:move", function (options) {
        // 减少绘制频率
        if (moveCount % 2 && !doDrawing) {
            return;
        }
        moveCount++;

        // 如果画笔为text,则不绘制
        if (!Object.is(window.drawConfig.penShape, 'text')) {
            let xy = transformMouse(options.pointer.x, options.pointer.y);
            mouseTo.x = xy.x;
            mouseTo.y = xy.y;
            drawing();
        }

    });

    canvas.on("mouse:up", function (options) {
        if (!Object.is(window.drawConfig.penShape, 'text')) {
            let xy = transformMouse(options.pointer.x, options.pointer.y);
            mouseTo.x = xy.x;
            mouseTo.y = xy.y;
        }
        
        if (callback) {
            // 如果 画笔型 为真 且 画笔型不为文本
            if (window.drawConfig.penShape && !Object.is(window.drawConfig.penShape, 'text')) {
                callback({
                    action: addGraph({mouseFrom, mouseTo})
                })
            }
        }

        drawingObject = null;
        doDrawing = false;
        moveCount = 1;
    });

    canvas.on("selection:cleared", () => { console.log('selection:cleared') });
    // canvas.on("object:modified", function (e) {
    //     console.log('object:modified')
    //     if (window.drawConfig.penShape === "text") {
    //         textContent = e.target.text;
    //         drawing();
    //     }
    // });

    canvas.on("selection:created", function (e) {
        let created = [];
        if (e.target._objects) {
            // 多选删除
            for (let i = 0; i < e.target._objects.length; i++) {
                let index = canvas._objects.findIndex((element) => element == e.target._objects[i])
                created.push(index);
            }
        } else {
            // 单选删除
            let index = canvas._objects.findIndex((element) => element == e.target)
            created.push(index);
        }
        canvas.removeCreated({created});

        if (callback) callback({
            action: removeCreated({created})
        })
    });

    canvas.on("path:created", function (e) {
        let path = e.path.path.toString().split(',').join(' ');
        let pathConfig = {
            fill: e.path.fill,
            stroke: e.path.stroke,
            strokeWidth: e.path.strokeWidth,
            strokeDashArray: e.path.strokeDashArray,
            strokeLineCap: e.path.strokeLineCap,
            strokeLineJoin: e.path.strokeLineJoin,
            strokeMiterLimit: e.path.strokeMiterLimit
        }

        if (callback) callback({
            action: addPath({path, pathConfig})
        })
    });

    // 自由绘制
    canvas.addPath = ({path, pathConfig}) => {
        canvas.add(new window.fabric.Path(path, pathConfig));
    }

    // 添加文本
    canvas.addText = (par) => {
        let tInput = new window.fabric.Textbox(par.textContent, {
            left: par.mouseFrom.x,
            top: par.mouseFrom.y,
            width: 150,
            fontSize: window.drawConfig.textSize,
            fill: window.drawConfig.penColor,
            hasControls: false
        });

        canvas.add(tInput);
    }

    canvas.removeCreated = ({created}) => {
        for (let i = 0; i < created.length; i++) {
            canvas.remove(canvas._objects[created[i]]);
        }
        //清楚选中框
        canvas.discardActiveObject();
    }

    // 添加图形
    canvas.addGraph = (par) => {
        mouseFrom = par.mouseFrom;
        mouseTo = par.mouseTo;
        switch (window.drawConfig.penShape) {
            case "line":
                canvas.add(createLine());
                break;
            case "ellipse":
                canvas.add(createEllipse());
                break;
            case "rectangle":
                canvas.add(createRectangle());
                break;
        }
    }

}

const transformMouse = (mouseX, mouseY) => {
    return { x: mouseX / window.zoom, y: mouseY / window.zoom };
}

// 绘制
const drawing = () => {
    if (!window.drawConfig.penShape) return;
    if (drawingObject){
        window.canvas.remove(drawingObject);
    }
    let curDrawing = null;
    switch (window.drawConfig.penShape) {
        case "line":
            // 直线
            curDrawing = createLine();
            break;
        case "text":
            // 文本
            textInput = new window.fabric.Textbox(textContent, {
                left: mouseFrom.x,
                top: mouseFrom.y,
                width: 150,
                fontSize: window.drawConfig.textSize,
                fill: window.drawConfig.penColor,
                hasControls: false
            });

            window.canvas.add(textInput);
            textInput.enterEditing();
            // textInput.hiddenTextarea.focus();
            textContent = "";
            break;
        case "ellipse":
            // 椭圆
            curDrawing = createEllipse();
            break;

        case "rectangle":
            curDrawing = createRectangle();
            break;
        case "eraser":
            break;

    }

    if (curDrawing) {
        window.canvas.add(curDrawing);
        drawingObject = curDrawing;
    }
}

const createLine = () => {
    return new window.fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
        stroke: window.drawConfig.penColor,
        strokeWidth: window.drawConfig.penSize,
        fill: '#fff',
        originX: 'center',
        originY: 'center'
    });
}

const createEllipse = () => {
    return new window.fabric.Ellipse({
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
}

const createRectangle = () => {
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
    return new window.fabric.Path(path, {
        left: mouseFrom.x,
        top: mouseFrom.y,
        stroke: window.drawConfig.penColor,
        strokeWidth: window.drawConfig.penSize,
        fill: "rgba(255,255,255,0)",
    });
}
export default sketchpadEngine;