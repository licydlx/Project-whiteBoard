/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-02 15:32:43
 * @LastEditTime: 2019-08-13 19:03:50
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import sketchpadEngine from '../../../depend/sketchpadEngine/sketchpadEngine';

class sketchpadBoard extends React.Component {
    constructor(props) {
        super(props);
        let {changeBoard} = {...this.props};

        // //配置
        // this.config = {
        //     height: 1080, //默认画板高、宽
        //     width: 1920,
        //     canvasParentId: "canvasBox",
        //     canvasId: "sketchpadBoard"
        //     };

        this.resize = () => {
            let winWidth = 0;
            let winHeight = 0;
            //函数：获取尺寸
            //获取窗口宽度
            if (window.innerWidth) {
                winWidth = window.innerWidth;
            } else if ((document.body) && (document.body.clientWidth)) {
                winWidth = document.body.clientWidth;
            }
            //获取窗口高度
            if (window.innerHeight) {
                winHeight = window.innerHeight;
            } else if ((document.body) && (document.body.clientHeight)) {
                winHeight = document.body.clientHeight;
            }
            let rate = winWidth / winHeight;
            if (rate > 16 / 9) {
                changeBoard(winHeight,winHeight * 16 / 9);
                this.setZoom(window.canvas,{
                    width:winHeight,
                    height:winHeight * 16 / 9
                });
            } else {
                changeBoard(winWidth,winWidth * 9 / 16);
                this.setZoom(window.canvas,{
                    width:winWidth,
                    height:winWidth * 9 / 16
                });
            }
        }
    }

    componentDidMount() {
        // 画板实例化
        sketchpadEngine('sketchpadBoard');

        this.setZoom(window.canvas);
        //监听窗体变化
        this.screenChange();
    }

    componentWillUnmount() {       
        window.removeEventListener('resize',this.resize);
    }
    
    screenChange(){
        window.addEventListener('resize', this.resize);
    }

    //设置缩放
    setZoom(canvas,client) {
        let zoom = 1;

        let eleWidth = client.width,
        eleHeight = client.height,
        cHeight = canvas.height,
        cWidth = canvas.width;
        let height = eleHeight > cHeight ? eleHeight : cHeight;
        let width = eleWidth > cWidth ? eleWidth : cWidth;
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
        let {boardSize} = {...this.props};
        console.log('render')
        console.log(boardSize)
        return <div id="canvasBox" style={{width:"95%"}}>
            <canvas id="sketchpadBoard" width={boardSize.width} height={boardSize.height}>请使用支持HTML5的浏览器</canvas>
        </div>
    }
}

export default sketchpadBoard;