

class sketchpadEngine {
    constructor(callback) {
        // 绘图始终
        // 绘制类型
        // 笔触宽度
        // 画笔颜色
        // 当前绘制对象
        // 绘制移动计数器
        // 绘制状态
        // 文本
        this.drawConfig = {
            drawType: 'line',
            mouseFrom: {},
            mouseTo: {},
            color: 'red',
            drawWidth: '2'
        }

        let doDrawing = false;
        let moveCount = 1;
        this.drawingObject = null;

        let canvas = new fabric.Canvas("sketchpad", {
            isDrawingMode: true,

        });
        this.canvas = canvas;
        //初次设置画板
        // this.setZoom(this.canvas);

        // //监听窗体变化
        // window.onresize = function () {
        //     this.setZoom(this.canvas);
        // }.bind(this);

        // // 画布与触点坐标修正
        // window.zoom = window.zoom ? window.zoom : 1;

        //绑定画板事件
        canvas.on("mouse:down", function (e) {
            let ve2 = this.transformMouse(e.e.offsetX, e.e.offsetY);
            this.drawConfig.mouseFrom.x = ve2.x;
            this.drawConfig.mouseFrom.y = ve2.y;

            console.log('mouse:down');
            console.log(ve2);

            doDrawing = true;
        }.bind(this));

        canvas.on("mouse:move", function (e) {
            if (moveCount % 2 && !doDrawing) {
                // 减少绘制频率
                return;
            }
            moveCount++;
            let ve2 = this.transformMouse(e.e.offsetX, e.e.offsetY);
            this.drawConfig.mouseTo.x = ve2.x;
            this.drawConfig.mouseTo.y = ve2.y;

           // this.drawing(this.drawConfig);
        }.bind(this));

        canvas.on("path:created", function (e) {
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
            if (callback) callback('pathCreated',JSON.stringify(drawObj));
        }.bind(this));

        canvas.on("mouse:up", function (e) {
            let ve2 = this.transformMouse(e.e.offsetX, e.e.offsetY);
            this.drawConfig.mouseTo.x = ve2.x;
            this.drawConfig.mouseTo.y = ve2.y;

            //this.drawing(this.drawConfig);
            this.drawingObject = null;
            doDrawing = false;
            moveCount = 1;
            doDrawing = false;
        }.bind(this));

    }

    //设置缩放
    setZoom(canvas) {
        let config = {
            height: 540, //默认画板高、宽
            width: 960,
            canvasParentId: "sketchpadBox"
        };
        let canvasDiv = document.getElementById(config.canvasParentId);

        let zoom = 1;
        let eleHeight = canvasDiv.clientHeight,
            eleWidth = canvasDiv.clientWidth,
            cHeight = canvas.height,
            cWidth = canvas.width;
        let height = eleHeight > cHeight ? eleHeight : cHeight;
        let width = eleWidth > cWidth ? eleWidth : cWidth;
        if (width > height) {
            //横版
            width = eleWidth;
            height = eleHeight;
            zoom = width / config.width;
        } else {
            //竖版
            height = height * eleHeight / configheight * 0.8;
            zoom = height / config.height;
        }
        canvas.setZoom(zoom);
        canvas.setWidth(width);
        canvas.setHeight(height);

        window.zoom = zoom;
        canvas.renderAll();
    }

    // 坐标转换
    transformMouse(mouseX, mouseY) {
        // return { x: mouseX / window.zoom, y: mouseY / window.zoom };
        return { x: mouseX , y: mouseY };
    }

    // 自由绘制
    pathCreated(data) {
        let path = new fabric.Path(data.path, data.pathConfig);
        this.canvas.add(path);
    }

    // 绘制
    drawing(pars) {
        if (this.drawingObject) {
            this.canvas.remove(this.drawingObject);
        }

        let curDrawing = null;
        switch (pars.drawType) {
            case "line":
                console.log('直线');
                
                console.log(pars);
                // 直线
                curDrawing = new fabric.Line([pars.mouseFrom.x, pars.mouseFrom.y, pars.mouseTo.x, pars.mouseTo.y], {
                    stroke: pars.color,
                    strokeWidth: pars.drawWidth
                });
                break;
        }

        if(curDrawing){
            this.canvas.add(curDrawing);
            this.drawingObject = curDrawing;
        }
        
    }
}

export default sketchpadEngine;