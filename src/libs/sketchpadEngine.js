class sketchpadEngine {
    constructor(callback) {
        this.callback = callback;
        // 绘图要素配置
        this.drawConfig = {
            mouseFrom: {},
            mouseTo: {},
            penShape: '',
            penSize: '2',
            penColor: '#fff',
            textSize: '14',
            textContent:'',
        }

        this.curMouseFrom = {};
        this.prevMouseFrom = {};
        // 文本
        this.textbox = null;
        // 当前绘制对象
        this.drawingObject = null;
        // 绘制移动计数器
        this.moveCount = 1;
        // 绘制状态
        this.doDrawing = false;

        this.canvas = new fabric.Canvas("sketchpad", {
            isDrawingMode: false,
            skipTargetFind: true,
            selectable: false,
            selection: false
        });

        // 绑定画板事件
        this.canvas.on("mouse:down", function (e) {
            if(Object.is(this.drawConfig.penShape,'text')) {
                this.prevMouseFrom = JSON.stringify(this.drawConfig.mouseFrom);
                this.drawConfig.textContent = '';
            }

            this.doDrawing = true;
            this.drawConfig.mouseFrom.x = e.e.offsetX;
            this.drawConfig.mouseFrom.y = e.e.offsetY;
            this.curMouseFrom = JSON.stringify(this.drawConfig.mouseFrom);
            this.drawing(this.drawConfig);

            console.log(this.prevMouseFrom);
            console.log(this.drawConfig.mouseFrom);
        }.bind(this));
        
        this.canvas.on("mouse:move", function (e) {
            // 减少绘制频率
            if (this.moveCount % 2 && !this.doDrawing) return;
            this.moveCount++;
            this.drawConfig.mouseTo.x = e.e.offsetX;
            this.drawConfig.mouseTo.y = e.e.offsetY;

            if(!Object.is(this.drawConfig.penShape,'text')) this.drawing(this.drawConfig);
        }.bind(this));

        this.canvas.on("path:created", function (e) {
            console.log('path:created')
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
            if (callback && this.canvas.isDrawingMode) callback('drawingFree', null, JSON.stringify(drawObj));
        }.bind(this));

        this.canvas.on("object:modified", function (e) {
            console.log('object:modified');
            let penShape = this.drawConfig.penShape;
            if(Object.is(penShape,'text')){
                this.drawConfig.textContent = e.target.text;
                let prevMouseFrom = JSON.parse(this.prevMouseFrom);
                this.drawConfig.mouseFrom = prevMouseFrom;
                if (callback && !this.canvas.isDrawingMode) callback('drawing', null, this.drawConfig);
            } 
        }.bind(this));

        this.canvas.on("mouse:up", function (e) {
            console.log('mouse:up')
            let penShape = this.drawConfig.penShape;
            if(Object.is(penShape,'text')){
                this.drawConfig.textContent = '';
                let curMouseFrom = JSON.parse(this.curMouseFrom);
                this.drawConfig.mouseFrom = curMouseFrom;
            } 
            if (callback && !this.canvas.isDrawingMode) callback('drawing', null, this.drawConfig);
            this.drawingObject = null;
            this.doDrawing = false;
            this.moveCount = 1;
        }.bind(this));

        this.canvas.on("object:added", function (e) {
            console.log('object:added')
        }.bind(this));

        this.canvas.on("selection:created", function (e) {
            console.log('selection:created') 
            // let newTotal = [];
            // if (e.target._objects) {
            //     for (let x = 0; x < this.canvas._objects.length; x++) {
            //         let found = e.target._objects.find(function (element) {
            //             return element == this.canvas._objects[x];
            //         }.bind(this));
            //         if (!found) newTotal.push(x)
            //     }
            // } else {
            //     for (let x = 0; x < this.canvas._objects.length; x++) {
            //         if (this.canvas._objects[x] !== e.target) {
            //             newTotal.push(x)
            //         }
            //     }
            // }
            // this.removeBlock(e);
            // if (callback) callback('removeBlock', JSON.stringify(newTotal), JSON.stringify(newTotal));
        }.bind(this));

        this.canvas.on("selection:cleared", function (e) { console.log('cleared') }.bind(this));

        this.canvas.on("object:removed", function (e) { console.log('object:removed') }.bind(this));
    }

    mouseDown(context, pars) {
        let ve2 = this.transformMouse(e.e.offsetX, e.e.offsetY);
        this.mouseFrom.x = ve2.x;
        this.mouseFrom.y = ve2.y;
        this.doDrawing = true;
    }

    removeAll() {
        this.canvas.clear()
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
    // transformMouse(mouseX, mouseY) {
    //     // return { x: mouseX / window.zoom, y: mouseY / window.zoom };
    //     return { x: mouseX, y: mouseY };
    // }

    // 自由绘制
    drawingFree(pars) {   
        if (typeof pars === 'string') pars = JSON.parse(pars);
        let path = new fabric.Path(pars.path, pars.pathConfig);
        this.canvas.add(path);
    }

    // 绘制
    drawing(pars,guest) {
        if (this.drawingObject && !guest) this.canvas.remove(this.drawingObject);
        let curDrawing = null;
        let mouseFrom = pars.mouseFrom;
        let mouseTo = pars.mouseTo;
        switch (pars.penShape) {
            case "line":
                // 直线
                curDrawing = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
                    stroke: pars.penColor,
                    strokeWidth: pars.penSize,
                    fill: '#fff',
                    originX: 'center',
                    originY: 'center'
                });
                break;
            case "arrow":
                // 箭头
                curDrawing = new fabric.Path(this.drawArrow(pars.mouseFrom.x, pars.mouseFrom.y, pars.mouseTo.x, pars.mouseTo.y, 20, 14), {
                    stroke: pars.penColor,
                    strokeWidth: pars.penSize
                });
                break;
            case "text":
                // 文本
                let text = '';
                if (pars.textContent) text = pars.textContent;
                this.textbox = new fabric.Textbox(text, {
                    left: pars.mouseFrom.x - 10,
                    top: pars.mouseFrom.y - 10,
                    width: 150,
                    fontSize: pars.textSize,
                    fill: pars.penColor,
                    hasControls: false
                });

                this.canvas.add(this.textbox);
                this.textbox.enterEditing();
                this.textbox.hiddenTextarea.focus();
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
                    stroke: pars.penColor,
                    strokeWidth: pars.penSize,
                });
                break;
            case "ellipse":
                // 椭圆
                curDrawing = new fabric.Ellipse({
                    stroke: pars.penColor,
                    strokeWidth: pars.penSize,
                    originX: "left",
                    originY: "top",
                    left: mouseFrom.x,
                    top: mouseFrom.y,
                    rx: Math.abs(mouseFrom.x - mouseTo.x),
                    ry: Math.abs(mouseFrom.y - mouseTo.y),
                });
                break;
            case "remove":
                break;
        }

        if (curDrawing) {
            this.canvas.add(curDrawing);
            if (!guest) this.drawingObject = curDrawing;
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