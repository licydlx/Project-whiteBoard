import React, { Component } from 'react';

class Test extends Component {
    constructor() {
        super();

        this.state = {
            tools: [
                {
                    type: 'toolsBox',
                    state: false,
                    attrStyle: null
                },
                {
                    type: 'sketchpad',
                    state: false,
                    attrStyle: null
                },
                {
                    type: 'pen',
                    state: false,
                    attrStyle: {
                        height: '120px'
                    },
                    attr: {
                        penSize: 2,
                        penColor: '#fff',
                    }
                },
                {
                    type: 'text',
                    state: false,
                    attrStyle: {
                        height: '120px'
                    },
                    attr: {
                        textSize: 14,
                        penColor: '#fff',
                    }
                },
                {
                    type: 'graph',
                    state: false,
                    attrStyle: {
                        height: '150px'
                    },
                    attr: {
                        penShape: 'line',
                        penSize: 2,
                        penColor: '#fff',
                    }
                },
                {
                    type: 'remove',
                    state: false,
                    attrStyle: null
                },
                {
                    type: 'empty',
                    state: false,
                    attrStyle: null
                },
            ],
            toolsCache: {
                preIndex: null,
                preState: null

            }
        }
    }

    // 工具被选中
    toolChoosed(e) {
        e.stopPropagation();
        // 设置新值
        // for (const key in e) {
        //     if (e.hasOwnProperty(key)) {
        //         console.log('关键字：' + key);
        //         console.log(e[key]);
        //     }
        // }
        const toolsArray = this.state.tools;
        const index = e._dispatchInstances.index;
        const cacheIndex = this.state.toolsCache.preIndex;
        toolsArray[index].state = true;

        // 根据tools缓存值重置
        if (cacheIndex !== null) {
            let preIndex = parseInt(cacheIndex);
            if (preIndex === index) {
                // toolsArray[index].state = toolsArray[index].state ? false : true;
            } else {
                toolsArray[preIndex].state = false;
            }

        }
        // 设置tools缓存值
        this.state.toolsCache.preIndex = index;
        // 渲染
        console.log(toolsArray);
        this.setState({ tools: toolsArray });
    }

    // 改变画笔粗细
    changePenSize() {

    }

    // 改变画笔颜色
    changePenColor() {

    }

    // 改变画笔形状
    changePenShape(index, e) {
        e.stopPropagation();
        const shape = e._dispatchInstances.key;
        // this.state.tools[index].attr = WaveShaperNode;
    }

    // 改变文本大小
    changeTextSize() {

    }

    // 画笔粗细模板
    penSizeTemplate(index) {
        let item = [2, 4, 6, 12].map((value) => {
            return <div>
                <div key={value} className='penSize' style={{ width: `${value}px`, height: `${value}px` }} onClick={this.changePenSize.bind(this, index)}></div>
            </div>
        })
        return <div className='AttrBox'> {item} </div>
    }

    // 画笔颜色模板
    penColorTemplate(index) {
        let item = ['#fff', '#9b9b9b', '#2e3038', '#000', '#fd2c0a', '#ff6e00', '#ffd400', '#98cd46', '#00d7d1', '#0097f0', '#8b6dc2', '#ff9b9e'].map((value) => {
            return <div>
                <div key={value} className='penColor' style={{ backgroundColor: `${value}` }} onClick={this.changePenColor.bind(this, index)}></div>
            </div>
        })
        return <div className='AttrBox'> {item} </div>
    }

    // 画笔文本模板
    textSizeTemplate(index) {
        let item = ['14', '18', '24', '36'].map((value) => {
            return <div>
                <div key={value} className='textSize' onClick={this.changeTextSize.bind(this, index)}>{value}</div>
            </div>
        })
        return <div className='AttrBox'> {item} </div>
    }

    // 画笔形状模板
    penShapeTemplate(index) {
        let item = ['line', 'ellipse', 'rectangle'].map((value) => {
            return <div>
                <div key={value} className={`penShape ${value}`} data-id={value} onClick={this.changePenShape.bind(this, index)}></div>
            </div>
        })
        return <div className='AttrBox'> {item} </div>
    }

    // 属性组装机
    toolAttrDom(attr, index) {
        if (!attr) return;
        return Object.keys(attr).map((value) => {
            return this[`${value}Template`](index);
        });
    }

    render() {
        const toolsArray = this.state.tools;
        const itmes = toolsArray.map((value, index) => {
            return <div className='tool' key={value.type} onClick={this.toolChoosed.bind(this)}>
                <div>{value.type}</div> 
                    <div id='toolAttr' className='toolAttr'  style={{ display: `${value.state ? 'block' : 'none'}`, height: `${value.attrStyle ? value.attrStyle.height : '0'}` }}>
                    {ttr, index)}
                </div>
            </div >
        })

        return (<div className={`drag`}>
            {itmes}
        </div >
        );
    }
}

export default Test;
