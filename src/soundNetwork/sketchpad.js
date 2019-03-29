

// 实例化画板区
var canvas = new fabric.Canvas("sketchpad", {
    isDrawingMode: true,
    skipTargetFind: true,
    selectable: false,
    selection: false
});

//变量声明
// 绘图始终
var mouseFrom = {};
var mouseTo = {};
// 绘制类型
var drawType = null;
// 笔触宽度
var drawWidth = 2;
// 画笔颜色
var color = "#E34F51";
// 当前绘制对象
var drawingObject = null;
// 绘制移动计数器
var moveCount = 1;
// 绘制状态
var doDrawing = false;
// 文本
var textbox = null;

window.canvas = canvas;
window.zoom = window.zoom ? window.zoom : 1;

//设置自由绘颜色
canvas.freeDrawingBrush.color = color;
//设置自由笔宽
canvas.freeDrawingBrush.width = drawWidth;

//绑定画板事件
canvas.on("mouse:down", function (options) {
    var xy = transformMouse(options.e.offsetX, options.e.offsetY);
    mouseFrom.x = xy.x;
    mouseFrom.y = xy.y;
    doDrawing = true;
});

canvas.on("mouse:move", function (options) {
    if (moveCount % 2 && !doDrawing) {
        //减少绘制频率
        return;
    }
    moveCount++;
    var xy = transformMouse(options.e.offsetX, options.e.offsetY);
    mouseTo.x = xy.x;
    mouseTo.y = xy.y;
    drawing();
});

canvas.on("mouse:up", function (options) {
    var xy = transformMouse(options.e.offsetX, options.e.offsetY);
    mouseTo.x = xy.x;
    mouseTo.y = xy.y;

    drawing();
    
    drawingObject = null;
    moveCount = 1;
    doDrawing = false;
});

canvas.on("selection:created", function (e) {
    if (e.target._objects) {
        //多选删除
        var etCount = e.target._objects.length;
        for (var etindex = 0; etindex < etCount; etindex++) {
            canvas.remove(e.target._objects[etindex]);
        }
    } else {
        //单选删除
        canvas.remove(e.target);
    }
    canvas.discardActiveObject(); //清楚选中框
});

//坐标转换
var transformMouse = function (mouseX, mouseY) {
    return { x: mouseX / window.zoom, y: mouseY / window.zoom };
}

// 画板选择工具事件绑定
var tools = document.getElementById('tools');
var chooseTools = function (event) {
    var el = event.target;
    while (el.tagName !== 'LI') {
        if (el === tools) {
            el = null;
            break;
        }
        el = el.parentNode;//返回當前元素的父节点
    }

    if (el) {
        drawType = el.getAttribute('data-type');

        canvas.isDrawingMode = false;

        if (textbox) {
            //退出文本编辑状态
            textbox.exitEditing();
            textbox = null;
        }
        if (drawType == "pen") {
            canvas.isDrawingMode = true;
        } else if (drawType == "remove") {
            canvas.selection = true;
            canvas.skipTargetFind = false;
            canvas.selectable = true;
        } else {
            // 画板元素不能被选中
            canvas.skipTargetFind = true;
            // 画板不显示选中
            canvas.selection = false;
        }

    }
}

tools.addEventListener('click', chooseTools);

// 绘制
var drawing = function () {
    if (drawingObject) canvas.remove(drawingObject);
    var canvasObject = null;

    switch (drawType) {
        case "arrow":
            // 箭头
            canvasObject = new fabric.Path(drawArrow(mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y, 25, 15), {
                stroke: color,
                fill: "rgba(255,255,255,0)",
                strokeWidth: drawWidth
            });
            break;
        case "line":
            // 直线
            canvasObject = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
                stroke: color,
                strokeWidth: drawWidth
            });
            break;
        case "dottedline":
            // 虚线
            canvasObject = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
                strokeDashArray: [3, 1],
                stroke: color,
                strokeWidth: drawWidth
            });
            break;
        case "text":
            // 文本
            textbox = new fabric.Textbox("", {
                left: mouseFrom.x - 10,
                top: mouseFrom.y - 10,
                width: 150,
                fontSize: 26,
                borderColor: "#2c2c2c",
                fill: color,
                hasControls: false
            });
            canvas.add(textbox);
            textbox.enterEditing();
            textbox.hiddenTextarea.focus();
            break;

        case "circle":
            // 正圆
            var left = mouseFrom.x;
            var top = mouseFrom.y;
            var radius = Math.sqrt((mouseTo.x - left) * (mouseTo.x - left) + (mouseTo.y - top) * (mouseTo.y - top)) / 2;
            canvasObject = new fabric.Circle({
                left: left,
                top: top,
                stroke: color,
                fill: "rgba(255, 255, 255, 0)",
                radius: radius,
                strokeWidth: drawWidth
            });
            break;

        case "ellipse":
            // 椭圆
            var left = mouseFrom.x;
            var top = mouseFrom.y;
            var radius = Math.sqrt((mouseTo.x - left) * (mouseTo.x - left) + (mouseTo.y - top) * (mouseTo.y - top)) / 2;
            canvasObject = new fabric.Ellipse({
                left: left,
                top: top,
                stroke: color,
                fill: "rgba(255, 255, 255, 0)",
                originX: "center",
                originY: "center",
                rx: Math.abs(left - mouseTo.x),
                ry: Math.abs(top - mouseTo.y),
                strokeWidth: drawWidth
            });
            break;

        case "rectangle":
            // 长方形
            var path =
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
            canvasObject = new fabric.Path(path, {
                left: left,
                top: top,
                stroke: color,
                strokeWidth: drawWidth,
                fill: "rgba(255, 255, 255, 0)"
            });
            break;
        case "remove":
            break;
    }

    if (canvasObject) {
        canvas.add(canvasObject);
        drawingObject = canvasObject;
    }
}

//绘制箭头方法
var drawArrow = function (fromX, fromY, toX, toY, theta, headlen) {
    theta = typeof theta != "undefined" ? theta : 30;
    headlen = typeof theta != "undefined" ? headlen : 10;
    // 计算各角度和对应的P2,P3坐标
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
    var arrowX = fromX - topX,
        arrowY = fromY - topY;
    var path = " M " + fromX + " " + fromY;
    path += " L " + toX + " " + toY;
    arrowX = toX + topX;
    arrowY = toY + topY;
    path += " M " + arrowX + " " + arrowY;
    path += " L " + toX + " " + toY;
    arrowX = toX + botX;
    arrowY = toY + botY;
    path += " L " + arrowX + " " + arrowY;
    return path;
}


