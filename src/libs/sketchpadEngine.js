
// class sketchpadEngine {

//     constructor(callback) {
//         this.callback = callback;

//         // 绘图始终
//         // 绘制类型
//         // 笔触宽度
//         // 画笔颜色
//         // 当前绘制对象
//         // 绘制移动计数器
//         // 绘制状态
//         // 文本
//         let config = {
//             mouseFrom:{},
//             mouseTo:{},
//             drawType:{},
//             drawWidth:2,
//             color:"#E34F51",
//             drawingObject:null,
//             moveCount:1,
//             doDrawing:false,
//             textbox:null
//         }

//         for (let key in config){
//             this.__proto__[key] = config[key];
//         }
    
 
//         // 实例化画板区
//         this.__proto__.canvas = new fabric.Canvas("sketchpad", {
//             isDrawingMode: true,
//             skipTargetFind: true,
//             selectable: false,
//             selection: false
//         });

//         // window.canvas = this.canvas;
//         // window.zoom = window.zoom ? window.zoom : 1;

//         // 设置自由绘颜色
//         this.__proto__.canvas.freeDrawingBrush.color = this.__proto__.color;
//         // 设置自由笔宽
//         this.__proto__.canvas.freeDrawingBrush.width = this.__proto__.drawWidth;

//         // 绑定画板事件
//         this.__proto__.canvas.on("mouse:down", function(options) {
//             let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
//             this.__proto__.mouseFrom.x = xy.x;
//             this.__proto__.mouseFrom.y = xy.y;
//             this.__proto__.doDrawing = true;

//             if (this.callback) this.callback(xy, 'mouseMove');
//         }.bind(this));

//         this.__proto__.canvas.on("mouse:move", function(options) {
//             if (this.__proto__.moveCount % 2 && !this.__proto__.doDrawing) {
//                 // 减少绘制频率
//                 return;
//             }

//             this.__proto__.moveCount++;
//             let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
//             this.__proto__.mouseTo.x = xy.x;
//             this.__proto__.mouseTo.y = xy.y;

//             console.log("mouse:move");
//             console.log(xy);
//             this.drawing();

//             if (this.callback) this.callback(xy, 'mouseMove');
//         }.bind(this));

//         this.__proto__.canvas.on("mouse:up", function(options) {
//             let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
//             this.__proto__.mouseTo.x = xy.x;
//             this.__proto__.mouseTo.y = xy.y;
    
//             this.drawing();
    
//             this.__proto__.drawingObject = null;
//             this.__proto__.moveCount = 1;
//             this.__proto__.doDrawing = false;


//             if (this.callback) this.callback(xy, 'mouseUp');
//         }.bind(this));

//         this.__proto__.canvas.on("selection:created", function (e) {
//             if (e.target._objects) {
//                 // 多选删除
//                 let etCount = e.target._objects.length;
//                 for (var etindex = 0; etindex < etCount; etindex++) {
//                     this.__proto__.canvas.remove(e.target._objects[etindex]);
//                 }
//             } else {
//                 // 单选删除
//                 this.__proto__.canvas.remove(e.target);
//             }
//             // 清楚选中框
//             this.__proto__.canvas.discardActiveObject();
//         }.bind(this));

//         // 画板选择工具事件绑定
//         // let tools = document.getElementById('tools');
//         // tools.addEventListener('click', this.chooseTools.bind(this), false);
//     }

    // mouseDown(options) {
    //     console.log('mouseDown');
    //     console.log(this);
    //     //return;
    //     // let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
    //     // this.mouseFrom.x = xy.x;
    //     // this.mouseFrom.y = xy.y;
    //     // this.doDrawing = true;
    // };

    // mouseMove(options) {
    //     console.log('mouseMove');
    //     console.log(this);
    //     this.drawWidth = 1;

    //     console.log(this.__proto__.drawWidth);
    //     // if (this.moveCount % 2 && !this.doDrawing) {
    //     //     // 减少绘制频率
    //     //     return;
    //     // }
    //     // this.moveCount++;
    //     // let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
    //     // this.mouseTo.x = xy.x;
    //     // this.mouseTo.y = xy.y;
    //     // this.drawing();
    // };

    // mouseUp(options) {
    //     console.log('mouseUp');
    //     console.log(this);
    //     let xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
    //     this.mouseTo.x = xy.x;
    //     this.mouseTo.y = xy.y;

    //     this.drawing();

    //     this.drawingObject = null;
    //     this.moveCount = 1;
    //     this.doDrawing = false;
    // };

    // chooseTools(event) {
    //     let el = event.target;

    //     while (el.tagName !== 'LI') {
    //         if (el === tools) {
    //             el = null;
    //             break;
    //         }
    //         // 返回當前元素的父节点
    //         el = el.parentNode;
    //     }

    //     if (el) {
    //         this._proto_.drawType = el.getAttribute('data-type');
    //         this.canvas.isDrawingMode = false;
    //         if (this._proto_.textbox) {
    //             // 退出文本编辑状态
    //             this._proto_.textbox.exitEditing();
    //             this._proto_.textbox = null;
    //         }
    //         if (this._proto_.drawType == "pen") {
    //             this.canvas.isDrawingMode = true;
    //         } else if (this.drawType == "remove") {
    //             this.canvas.selection = true;
    //             this.canvas.skipTargetFind = false;
    //             this.canvas.selectable = true;
    //         } else {
    //             // 画板元素不能被选中
    //             this.canvas.skipTargetFind = true;
    //             // 画板不显示选中
    //             this.canvas.selection = false;
    //         }
    //     }
    // }

//     // 坐标转换
//     transformMouse(mouseX, mouseY) {
//         return { x: mouseX / window.zoom, y: mouseY / window.zoom };
//     }

//     // 绘制
//     drawing() {
//         let that = this;

//         if (that.__proto__.drawingObject) that.__proto__.canvas.remove(that.__proto__.drawingObject);
//         let canvasObject = null;

//         switch (that.__proto__.drawType) {
//             case "arrow":
//                 // 箭头
//                 canvasObject = new fabric.Path(that.drawArrow(that.__proto__.mouseFrom.x, that.__proto__.mouseFrom.y, that.__proto__.mouseTo.x, that.__proto__.mouseTo.y, 25, 15), {
//                     stroke: that.__proto__.color,
//                     fill: "rgba(255,255,255,0)",
//                     strokeWidth: that.__proto__.drawWidth
//                 });
//                 break;
//             // case "line":
//             //     // 直线
//             //     canvasObject = new fabric.Line([that.mouseFrom.x, that.mouseFrom.y, that.mouseTo.x, that.mouseTo.y], {
//             //         stroke: that.color,
//             //         strokeWidth: that.drawWidth
//             //     });
//             //     break;
//             // case "dottedline":
//             //     // 虚线
//             //     canvasObject = new fabric.Line([that.mouseFrom.x, that.mouseFrom.y, that.mouseTo.x, that.mouseTo.y], {
//             //         strokeDashArray: [3, 1],
//             //         stroke: that.color,
//             //         strokeWidth: that.drawWidth
//             //     });
//             //     break;
//             // case "text":
//             //     // 文本
//             //     that.textbox = new fabric.Textbox("", {
//             //         left: that.mouseFrom.x - 10,
//             //         top: that.mouseFrom.y - 10,
//             //         width: 150,
//             //         fontSize: 26,
//             //         borderColor: "#2c2c2c",
//             //         fill: that.color,
//             //         hasControls: false
//             //     });
//             //     that.canvas.add(that.textbox);
//             //     that.textbox.enterEditing();
//             //     that.textbox.hiddenTextarea.focus();
//             //     break;

//             // case "circle":
//             //     // 正圆
//             //     var left = that.mouseFrom.x;
//             //     var top = that.mouseFrom.y;
//             //     var radius = Math.sqrt((that.mouseTo.x - left) * (that.mouseTo.x - left) + (that.mouseTo.y - top) * (that.mouseTo.y - top)) / 2;
//             //     canvasObject = new fabric.Circle({
//             //         left: left,
//             //         top: top,
//             //         stroke: that.color,
//             //         fill: "rgba(255, 255, 255, 0)",
//             //         radius: radius,
//             //         strokeWidth: that.drawWidth
//             //     });
//             //     break;

//             // case "ellipse":
//             //     // 椭圆
//             //     var left = that.mouseFrom.x;
//             //     var top = that.mouseFrom.y;
//             //     var radius = Math.sqrt((that.mouseTo.x - left) * (that.mouseTo.x - left) + (that.mouseTo.y - top) * (that.mouseTo.y - top)) / 2;
//             //     canvasObject = new fabric.Ellipse({
//             //         left: left,
//             //         top: top,
//             //         stroke: that.color,
//             //         fill: "rgba(255, 255, 255, 0)",
//             //         originX: "center",
//             //         originY: "center",
//             //         rx: Math.abs(left - that.mouseTo.x),
//             //         ry: Math.abs(top - that.mouseTo.y),
//             //         strokeWidth: that.drawWidth
//             //     });
//             //     break;

//             // case "rectangle":
//             //     // 长方形
//             //     var path =
//             //         "M " +
//             //         that.mouseFrom.x +
//             //         " " +
//             //         that.mouseFrom.y +
//             //         " L " +
//             //         that.mouseTo.x +
//             //         " " +
//             //         that.mouseFrom.y +
//             //         " L " +
//             //         that.mouseTo.x +
//             //         " " +
//             //         that.mouseTo.y +
//             //         " L " +
//             //         that.mouseFrom.x +
//             //         " " +
//             //         that.mouseTo.y +
//             //         " L " +
//             //         that.mouseFrom.x +
//             //         " " +
//             //         that.mouseFrom.y +
//             //         " z";
//             //     canvasObject = new fabric.Path(path, {
//             //         left: left,
//             //         top: top,
//             //         stroke: that.color,
//             //         strokeWidth: that.drawWidth,
//             //         fill: "rgba(255, 255, 255, 0)"
//             //     });
//             //     break;
//             case "remove":
//                 break;
//         }

//         if (canvasObject) {
//             that.__proto__.canvas.add(canvasObject);
//             that.__proto__.drawingObject = canvasObject;
//         }
//     }

//     // //绘制箭头方法
//     // drawArrow(fromX, fromY, toX, toY, theta, headlen) {
//     //     theta = typeof theta != "undefined" ? theta : 30;
//     //     headlen = typeof theta != "undefined" ? headlen : 10;
//     //     // 计算各角度和对应的P2,P3坐标
//     //     let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
//     //         angle1 = (angle + theta) * Math.PI / 180,
//     //         angle2 = (angle - theta) * Math.PI / 180,
//     //         topX = headlen * Math.cos(angle1),
//     //         topY = headlen * Math.sin(angle1),
//     //         botX = headlen * Math.cos(angle2),
//     //         botY = headlen * Math.sin(angle2);
//     //     let arrowX = fromX - topX,
//     //         arrowY = fromY - topY;
//     //     let path = " M " + fromX + " " + fromY;
//     //     path += " L " + toX + " " + toY;
//     //     arrowX = toX + topX;
//     //     arrowY = toY + topY;
//     //     path += " M " + arrowX + " " + arrowY;
//     //     path += " L " + toX + " " + toY;
//     //     arrowX = toX + botX;
//     //     arrowY = toY + botY;
//     //     path += " L " + arrowX + " " + arrowY;
//     //     return path;
//     // }
// }


class sketchpadEngine {

    constructor(callback) {
        this.callback = callback;

        if(!this.__proto__.name){
            this.__proto__.name = '李冲';
         }

        let tools = document.getElementById('tools');
        let test = document.getElementById('test');
        
        tools.addEventListener("click", function(){
            test.innerHTML = this.__proto__.name;

            if(callback){
                callback(this.__proto__.name,'getName');
            }
        }.bind(this), false);

    }

    getName(name){
        console.log(this);
        let test = document.getElementById('test');
        test.innerHTML = name;
    }
}

export default sketchpadEngine;