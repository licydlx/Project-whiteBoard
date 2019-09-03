/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-02 15:32:43
 * @LastEditTime: 2019-09-03 16:09:28
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

    componentWillReceiveProps(nextProps) { }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("shouldComponentUpdate");
        if (nextProps.sketchpad == this.props) {
            return false;
        } else {
            const { tools, boardData } = { ...nextProps };
            if (tools !== this.props.tools) {
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

            if (boardData !== this.props.boardData) {
                if(boardData.account !== SignalData.account){
                    switch (boardData.type) {
                        case "BOARD_ADD_PATH":
                            canvas.addPath({ path: boardData.path, pathConfig: boardData.pathConfig })
                            break;
    
                        case "BOARD_ADD_TEXT":
                            canvas.addText({ mouseFrom: boardData.mouseFrom, textContent: boardData.textContent })
                            break;
    
                        case "BOARD_ADD_GRAPH":
                            canvas.addGraph({ mouseFrom: boardData.mouseFrom, mouseTo: boardData.mouseTo })
                            break;
    
                        case "BOARD_REMOVE_CREATED":
                            canvas.removeCreated({ created: boardData.created })
                            break;
                    }
                    return true;
                }
            }
            return false;
        }
    }

    render() {
        return <div id="canvasBox" className="canvasBox" style={{ visibility: `${this.props.tools[0].active ? "hidden" : "visible"}` }} >
            <canvas id="sketchpadBoard" width={this.config.width} height={this.config.height}>请使用支持HTML5的浏览器</canvas>
        </div>
    }
}

export default sketchpadBoard;