/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-02 15:32:43
 * @LastEditTime: 2019-09-20 18:04:51
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import './index.css';
import SignalData from '../../../depend/agoraSingal/SignalData';
class sketchpadBoard extends React.Component {
    constructor(props) {
        super(props);
        // 配置
        this.config = {
            width: 960,
            height: 540, //默认画板高、宽
        };
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.sketchpad == this.props) {
            return false;
        } else {
            const { zIndex, tools, boardData } = { ...nextProps };
            if (zIndex !== this.props.zIndex) {
                return true;
            }

            if (tools !== this.props.tools) {
                const tool = tools.filter(tool => tool.active === true);
                switch (tool[0].name) {
                    case 'pen':
                        window.canvas.isDrawingMode = true;
                        window.canvas.freeDrawingBrush.color = tool[0].penColor;
                        window.canvas.freeDrawingBrush.width = tool[0].penSize;
                        window.drawConfig.penShape = '';
                        break;
                    case 'text':
                        window.canvas.isDrawingMode = false;
                        window.canvas.skipTargetFind = true;
                        window.canvas.selection = false;
                        window.drawConfig.penShape = 'text';
                        window.drawConfig.textSize = tool[0].textSize;
                        window.drawConfig.penColor = tool[0].penColor;
                        break;
                    case 'graph':
                        window.canvas.isDrawingMode = false;
                        window.canvas.skipTargetFind = true;
                        window.canvas.selection = false;
                        window.drawConfig.penColor = tool[0].penColor;
                        window.drawConfig.penShape = tool[0].penShape;
                        window.drawConfig.penSize = tool[0].penSize;
                        break;

                    case 'eraser':
                        window.canvas.isDrawingMode = false;
                        window.canvas.selection = true;
                        window.canvas.skipTargetFind = false;
                        window.canvas.selectable = true;
                        window.drawConfig.penShape = tool[0].penShape;
                        break;
                    case 'empty':
                        window.canvas.clear();
                        break;
                }
                return true;
            }

            if (boardData !== this.props.boardData) {
                if (boardData.account !== SignalData.account) {
                    switch (boardData.type) {
                        case "BOARD_ADD_PATH":
                            window.canvas.addPath({ path: boardData.path, pathConfig: boardData.pathConfig })
                            break;

                        case "BOARD_ADD_TEXT":
                            window.canvas.addText({ mouseFrom: boardData.mouseFrom, textContent: boardData.textContent })
                            break;

                        case "BOARD_ADD_GRAPH":
                            window.canvas.addGraph({ mouseFrom: boardData.mouseFrom, mouseTo: boardData.mouseTo })
                            break;

                        case "BOARD_REMOVE_CREATED":
                            window.canvas.removeCreated({ created: boardData.created })
                            break;
                    }
                    return true;
                }
            }
            return false;
        }
    }

    render() {
        return <div id="canvasBox" className="canvasBox" style={{ visibility: `${this.props.tools[1].active ? "hidden" : "visible"}`, zIndex: this.props.zIndex }} >
            <canvas id="sketchpadBoard" width={this.config.width} height={this.config.height}>请使用支持HTML5的浏览器</canvas>
        </div>
    }
}

export default sketchpadBoard;