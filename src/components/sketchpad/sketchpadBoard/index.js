/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-02 15:32:43
 * @LastEditTime: 2019-08-21 18:24:30
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

    render() {
        return <div id="canvasBox" className="canvasBox" style={{ visibility: `${this.props.tools[0].active ? "hidden" : "visible"}` }} >
            <canvas id="sketchpadBoard" width={this.config.width} height={this.config.height}>请使用支持HTML5的浏览器</canvas>
        </div>

    }
}

export default sketchpadBoard;