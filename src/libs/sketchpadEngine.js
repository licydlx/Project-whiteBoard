class sketchpadEngine {
    constructor(callback) {
        this.callback = callback;
        // 绘图始终
        this.mouseFrom = {};
        this.mouseTo = {};
        // 绘制类型
        this.drawType = '';
        // 笔触宽度
        this.drawWidth = 2;
        // 画笔颜色
        this.color = "#E34F51";
        // 当前绘制对象
        this.drawingObject = null;
        // 绘制移动计数器
        this.moveCount = 1;
        // 绘制状态
        this.doDrawing = false;
        // 文本
        this.textbox = null;

        this.canvas = new fabric.Canvas("sketchpad", {
            isDrawingMode: true,
            skipTargetFind: true,
            selectable: false,
            selection: false
        });

        //设置自由绘颜色
        this.canvas.freeDrawingBrush.color = this.color;
        //设置自由笔宽
        this.canvas.freeDrawingBrush.width = this.drawWidth;

        //绑定画板事件
        this.canvas.on("mouse:down", function (e) {
            let ve2 = this.transformMouse(e.e.offsetX, e.e.offsetY);
            this.mouseFrom.x = ve2.x;
            this.mouseFrom.y = ve2.y;
            this.doDrawing = true;

            // this.drawing();
            // let data = this.dataFiltering();
            if (callback) callback(null, 'mouseDown');
        }.bind(this));

        this.canvas.on("mouse:move", function (e) {
            if (this.moveCount % 2 && !this.doDrawing) {
                // 减少绘制频率
                return;
            }
            this.moveCount++;
            let ve2 = this.transformMouse(e.e.offsetX, e.e.offsetY);
            this.mouseTo.x = ve2.x;
            this.mouseTo.y = ve2.y;

            this.drawing();

            let data = this.dataFiltering();
            if (callback) callback('drawing', JSON.stringify(data), JSON.stringify(data));
        }.bind(this));

        this.canvas.on("path:created", function (e) {
            let drawPaths = e.path.path.toString().split(',').join(' ');
            let drawObj = {
                path: drawPaths,
                pathConfig: {
                    fill: e.path.fill,
                    stroke: e.path.stroke,
                    strokeWidth: e.path.strokeWidth,
                    strokeDashArray: e.path.strokeDashArray,
                    strokeLineCap: e.path.strokeLineCap,
                    strokeLineJoin: e.path.strokeLineJoin,
                    strokeMiterLimit: e.path.strokeMiterLimit
                }
            }

            let data = this.dataFiltering();
            if (callback) callback('pathCreated',JSON.stringify(data), JSON.stringify(drawObj));
        }.bind(this));

        this.canvas.on("mouse:up", function (e) {
            //console.log('mouse:up');
            let ve2 = this.transformMouse(e.e.offsetX, e.e.offsetY);
            this.mouseTo.x = ve2.x;
            this.mouseTo.y = ve2.y;

            //let data = this.dataFiltering();
            if (callback) callback(null,'mouseUp');
            //this.drawing(this.drawConfig);
            this.drawingObject = null;
            this.doDrawing = false;
            this.moveCount = 1;
            this.doDrawing = false;
        }.bind(this));

        this.canvas.on("object:added", function (e) {
            //console.log('object:added');
            // console.log(e);
        }.bind(this));

        this.canvas.on("object:modified", function (e) {
            //console.log('object:modified');
            if (this.drawType === 'text') {
                let text = e.target.text;
                let data = this.dataFiltering();
                data.text = text;
                if (callback) callback('drawing', JSON.stringify(data), JSON.stringify(data));
            }
        }.bind(this));

        this.canvas.on("selection:created", function (e) {
            let newTotal = [];
            if (e.target._objects) {
                for (let x = 0; x < this.canvas._objects.length; x++) {
                    let found = e.target._objects.find(function (element) {
                        return element == this.canvas._objects[x];
                    }.bind(this));
                    if (!found) newTotal.push(x)
                }
            } else {
                for (let x = 0; x < this.canvas._objects.length; x++) {
                    if(this.canvas._objects[x] !== e.target){
                        newTotal.push(x)
                    }
                }
            }
            this.removeBlock(e);
            if (callback) callback('removeBlock', JSON.stringify(newTotal),JSON.stringify(newTotal));
        }.bind(this));

        // this.canvas.on("selection:cleared", function (e) {
        //     console.log('cleared');
        // }.bind(this));

        // this.canvas.on("object:removed", function (e) {
        //     console.log('object:removed');
        // }.bind(this));
    }

    mouseDown(context,pars){
        let ve2 = this.transformMouse(e.e.offsetX, e.e.offsetY);
        this.mouseFrom.x = ve2.x;
        this.mouseFrom.y = ve2.y;
        this.doDrawing = true;
    }

    removeBlock(e) {
        if (e.target._objects) {
            //多选删除
            let etCount = e.target._objects.length;
            for (let etindex = 0; etindex < etCount; etindex++) {
                this.canvas.remove(e.target._objects[etindex]);
            }
        } else {
            //单选删除
            this.canvas.remove(e.target);
        }
        //清楚选中框
        this.canvas.discardActiveObject();
    }

    // 传输数据过滤
    dataFiltering() {
        let obj = {}
        let keys = Object.keys(this);
        let values = Object.values(this);
        keys.forEach(function (value, index) {
            if (value !== "canvas" && value !== "callback") {
                obj[value] = values[index];
            }
        });
        return obj
    }
    // 坐标转换
    transformMouse(mouseX, mouseY) {
        // return { x: mouseX / window.zoom, y: mouseY / window.zoom };
        return { x: mouseX, y: mouseY };
    }

    // 自由绘制
    pathCreated(context,data) {
        if (typeof data === 'string') data = JSON.parse(data);
        let path = new fabric.Path(data.path, data.pathConfig);
        this.canvas.add(path);
    }

    // 绘制
    drawing(context,pars) {
        if (!pars) {
            pars = this;
        } else {
            if (typeof pars === 'string') pars = JSON.parse(pars);
        }

        if (this.drawingObject) {
            this.canvas.remove(this.drawingObject);
        }

        let curDrawing = null;
        switch (pars.drawType) {
            case "line":
                // 直线
                curDrawing = new fabric.Line([pars.mouseFrom.x, pars.mouseFrom.y, pars.mouseTo.x, pars.mouseTo.y], {
                    stroke: pars.color,
                    strokeWidth: pars.drawWidth
                });
                break;
            case "arrow":
                // 箭头
                curDrawing = new fabric.Path(this.drawArrow(pars.mouseFrom.x, pars.mouseFrom.y, pars.mouseTo.x, pars.mouseTo.y, 20, 14), {
                    stroke: pars.color,
                    fill: "rgba(255,255,255,0)",
                    strokeWidth: pars.drawWidth
                });
                break;
            case "text":
                // 文本
                let text = "";
                if (pars.text) text = pars.text;
                this.textbox = new fabric.Textbox(text, {
                    left: pars.mouseFrom.x - 10,
                    top: pars.mouseFrom.y - 10,
                    width: 150,
                    fontSize: 26,
                    borderColor: "#2c2c2c",
                    fill: pars.color,
                    hasControls: false
                });

                // console.log(this.textbox);
                // this.textbox.on("added", function (e) {
                //     console.log('added');
                //     // console.log(e);
                // }.bind(this));

                // this.textbox.on("mousedown", function (e) {
                //     console.log('mousedown');
                //     // console.log(e);
                // }.bind(this));

                this.canvas.add(this.textbox);
                this.textbox.enterEditing();
                this.textbox.hiddenTextarea.focus();
                break;

            case "rectangle":
                let mouseFrom = pars.mouseFrom;
                let mouseTo = pars.mouseTo;
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
                curDrawing = new fabric.Path(path, {
                    left: mouseFrom.x,
                    top: mouseFrom.y,
                    stroke: pars.color,
                    strokeWidth: pars.drawWidth,
                    fill: "rgba(255, 255, 255, 0)"
                });
                break;

            case "ellipse":
                // 椭圆
                let left = pars.mouseFrom.x;
                let top = pars.mouseFrom.y;
                // let radius = Math.sqrt((mouseTo.x - left) * (mouseTo.x - left) + (mouseTo.y - top) * (mouseTo.y - top)) / 2;
                curDrawing = new fabric.Ellipse({
                    left: left,
                    top: top,
                    stroke: pars.color,
                    fill: "rgba(255, 255, 255, 0)",
                    originX: "left",
                    originY: "top",
                    rx: Math.abs(left - pars.mouseTo.x),
                    ry: Math.abs(top - pars.mouseTo.y),
                    strokeWidth: pars.drawWidth
                });
                break;

            case "remove":
                break;
        }


        if (curDrawing) {
            this.canvas.add(curDrawing);
            this.drawingObject = curDrawing;
        }
    }

    //绘制箭头方法
    drawArrow(fromX, fromY, toX, toY, theta, headlen) {
        theta = typeof theta != "undefined" ? theta : 30;
        headlen = typeof theta != "undefined" ? headlen : 10;
        // 计算各角度和对应的P2,P3坐标
        let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
            angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180,
            topX = headlen * Math.cos(angle1),
            topY = headlen * Math.sin(angle1),
            botX = headlen * Math.cos(angle2),
            botY = headlen * Math.sin(angle2);
        let arrowX = fromX - topX,
            arrowY = fromY - topY;
        let path = " M " + fromX + " " + fromY;
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
}

export default sketchpadEngine;