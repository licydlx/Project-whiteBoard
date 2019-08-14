/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-02 15:32:43
 * @LastEditTime: 2019-08-14 19:04:13
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import './index.css';

import sketchpadEngine from '../../../depend/sketchpadEngine/sketchpadEngine';

class sketchpadBoard extends React.Component {
    constructor(props) {
        super(props);

        // 配置
        this.config = {
            width: 960,
            height: 540, //默认画板高、宽
        };

        // this.resize = () => {
        //     let winWidth = 0;
        //     let winHeight = 0;
        //     //函数：获取尺寸
        //     //获取窗口宽度
        //     if (window.innerWidth) {
        //         winWidth = window.innerWidth;
        //     } else if ((document.body) && (document.body.clientWidth)) {
        //         winWidth = document.body.clientWidth;
        //     }
        //     //获取窗口高度
        //     if (window.innerHeight) {
        //         winHeight = window.innerHeight;
        //     } else if ((document.body) && (document.body.clientHeight)) {
        //         winHeight = document.body.clientHeight;
        //     }
        //     let rate = winWidth / winHeight;
        //     if (rate > 16 / 9) {
        //        // changeBoard(winHeight,winHeight * 16 / 9);
        //         this.setZoom(window.canvas,{
        //             width:winHeight,
        //             height:winHeight * 16 / 9
        //         });
        //     } else {
        //        // changeBoard(winWidth,winWidth * 9 / 16);
        //         this.setZoom(window.canvas,{
        //             width:winWidth,
        //             height:winWidth * 9 / 16
        //         });
        //     }
        // }
    }

    componentDidMount() {
        // 画板实例化
        sketchpadEngine('sketchpadBoard');

        // 画布对比可视窗 伸缩比
        this.setZoom(window.canvas);
        //监听窗体变化
        // this.screenChange();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    componentWillReceiveProps(nextProps) { }

    shouldComponentUpdate(nextProps, nextState) {
        const { tools } = { ...nextProps };
        const tool = tools.filter(tool => tool.active === true);
        switch (tool[0].name) {
            case 'pen':
                canvas.isDrawingMode = true;
                canvas.freeDrawingBrush.color = tool[0].penColor;
                canvas.freeDrawingBrush.width = tool[0].penSize;
                window.drawConfig.penShape = '';
                break;
            case 'text':
                canvas.isDrawingMode = false;
                canvas.skipTargetFind = true;
                canvas.selection = false;
                window.drawConfig.penShape = 'text';
                window.drawConfig.textSize = tool[0].textSize;
                window.drawConfig.penColor = tool[0].penColor;
                break;
            case 'graph':
                canvas.isDrawingMode = false;
                canvas.skipTargetFind = true;
                canvas.selection = false;
                window.drawConfig.penColor = tool[0].penColor;
                window.drawConfig.penShape = tool[0].penShape;
                window.drawConfig.penSize = tool[0].penSize;
                break;

            case 'eraser':
                canvas.isDrawingMode = false;
                canvas.selection = true;
                canvas.skipTargetFind = false;
                canvas.selectable = true;
                window.drawConfig.penShape = tool[0].penShape;
                break;
            case 'empty':
                canvas.clear();
                break;
        }

        return true;
    }

    screenChange() {
        window.addEventListener('resize', this.resize);
    }

    //设置缩放
    setZoom(canvas) {
        // 任务
        // 对可视区，元素高宽等做些研究，归纳
        // 2019-08-14
        let zoom = 1;
        let eleWidth = document.body.clientWidth,
            eleHeight = document.body.clientHeight,
            cHeight = canvas.height,
            cWidth = canvas.width;
        let width = eleWidth > cWidth ? eleWidth : cWidth;
        let height = eleHeight > cHeight ? eleHeight : cHeight;
        if (width > height) {
            //横版
            width = eleWidth;
            height = eleHeight;
            zoom = width / this.config.width;
        } else {
            //竖版
            height = height * eleHeight / this.config.height * 0.8;
            zoom = height / this.config.height;
        }
        canvas.setZoom(zoom);
        canvas.setWidth(width);
        canvas.setHeight(height);
        window.zoom = zoom;
        canvas.renderAll();
    }

    render() {
        return <div id="canvasBox" className="canvasBox" style={{ visibility: `${this.props.tools[0].active ? "hidden" : "visible"}` }} >
            <canvas id="sketchpadBoard" width={this.config.width} height={this.config.height}>请使用支持HTML5的浏览器</canvas>
        </div>

    }
}

export default sketchpadBoard;