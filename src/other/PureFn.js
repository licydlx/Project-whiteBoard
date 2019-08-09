/**
 * @description: 函数式编程 
 * @param {type} 
 * @return: 
 */

// 副作用是在计算结果的过程中，系统状态的一种变化，或者与外部世界进行的可观察的交互。
// 副作用可能包含，但不限于：
// 更改文件系统
// 往数据库插入记录
// 发送一个 http 请求
// 可变数据
// 打印/log
// 获取用户输入
// DOM 查询
// 访问系统状态

// 纯函数
// 可缓存性（Cacheable）
// 可移植性／自文档化（Portable / Self-Documenting）
// 可测试性（Testable）
// 合理性（Reasonable）
// 并行代码

import React from 'react';
import { curry } from 'lodash';
import PDFJS from 'pdfjs-dist';
import PDFWORKER from 'pdfjs-dist/build/pdf.worker.js';

// // DOM获取
// const getDom = (document,id) => document.getElementById(id);
// // DOM操作
// const getDomAttr = dom => dom.getAttr();
// '声明式'

class PureFn extends React.Component {
    constructor() {
        super();
        PDFJS.GlobalWorkerOptions.workerSrc = PDFWORKER;
    }
    
    componentDidMount() {
        let url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';
        PDFJS.getDocument(url).then((pdf) => {
            return pdf.getPage(1);
        }).then((page) => {
            // 设置展示比例
            let scale = 2;
            // 获取pdf尺寸
            let viewport = page.getViewport(scale);
            // 获取需要渲染的元素
            let canvas = document.getElementById('pdf-canvas');
            let context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            let renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            page.render(renderContext);
        });

        // const compose = (...fns) => fns.reduceRight((acc, fn) => (...args) => fn(acc(...args)));
        // // const getDom = () => x + 1;
        // const getWindowSize = () => {
        //     if (window.innerWidth && window.innerHeight) {
        //         return [window.innerWidth, window.innerHeight]
        //     } else if ((document.body) && (document.body.clientWidth)) {
        //         return [document.body.clientWidth, document.body.clientHeight]
        //     }
        // };
        // // 
        // const setCanvaSize = (...arg) => arg[0][0]/arg[0][1] > 16/9 ? [arg[0][1]*9/16,arg[0][1]] : [arg[0][0],arg[0][0]*9/16];

        // const addOneThenSquare = compose(setCanvaSize, getWindowSize);

        // console.log(addOneThenSquare());
    }

    // angle(fromX, fromY, toX, toY) {
    //     return Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI;
    // }

    // // 绘制箭头方法 
    // drawArrow(fromX, fromY, toX, toY, theta, headlen) {

    //     theta = typeof theta != "undefined" ? theta : 30;
    //     headlen = typeof theta != "undefined" ? headlen : 10;
    //     // 计算各角度和对应的P2,P3坐标
    //     let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,

    //         angle1 = (angle + theta) * Math.PI / 180,
    //         angle2 = (angle - theta) * Math.PI / 180,
    //         topX = headlen * Math.cos(angle1),
    //         topY = headlen * Math.sin(angle1),
    //         botX = headlen * Math.cos(angle2),
    //         botY = headlen * Math.sin(angle2);

    //     let path = ` M ${fromX} ${fromY} L ${toX} ${topY} M ${toX + topX} ${toY + topY} L ${toX} ${toY} L ${totoX + botX} ${toY + botY}`;
    //     return path;
    // }

    render() {
        return <canvas id="pdf-canvas">
        </canvas>
    }
}

export default PureFn;
