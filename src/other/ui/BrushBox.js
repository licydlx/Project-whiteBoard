import React, { Component } from 'react';
import './BrushBox.css';

class BrushBox extends Component {
    constructor(props) {
        super(props);

        this.penConfig = {
            penSize: [2, 4, 6, 12],
            penColor: ['#fff', '#9b9b9b', '#2e3038', '#000', '#fd2c0a', '#ff6e00', '#ffd400', '#98cd46', '#00d7d1', '#0097f0', '#8b6dc2', '#ff9b9e'],
            textSize: ['14', '18', '24', '36'],
            penShape: ['line', 'ellipse', 'rectangle', ''],
            shapeImg: {
                'line': 'https://res.miaocode.com/livePlatform/soundNetwork/images/pathdouble.png',
                'ellipse': 'https://res.miaocode.com/livePlatform/soundNetwork/images/ovaldouble.png',
                'rectangle': 'https://res.miaocode.com/livePlatform/soundNetwork/images/rectangledouble.png',
            }
        }

        this.tools = [
            {
                type: 'sketchpad',
                imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/02double.png',
            },
            {
                type: 'pen',
                imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/03double.png',
                attrStyle: {
                    height: '120px'
                },
                attr: ['penSize', 'penColor']
            },
            {
                type: 'text',
                imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/04double.png',
                attrStyle: {
                    height: '120px'
                },
                attr: ['textSize', 'penColor']
            },
            {
                type: 'graph',
                imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/07double.png',
                attrStyle: {
                    height: '150px'
                },
                attr: ['penShape', 'penColor']
            },
            {
                type: 'remove',
                imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/06double.png',
            },
            {
                type: 'empty',
                imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/05double.png',
            },
        ];
    }

    // // 画板参数变化
    // sketchpadChange(pars){
    //     this.props.sketchpadChange(pars,true);
    // }

    // childCallback(pars){
    //     this.props.childCallback(pars);
    // }

    // broadcastMessage(belong, method, context, pars){ // 此处使用箭头函数，避免bind绑定
    //     this.props.broadcastMessage(belong, method, context, pars);
    // }

    // 工具被选中
    brushChoosed(e) {
        e.preventDefault();
        // 设置新值
        // for (const key in e) {
        //     if (e.hasOwnProperty(key)) {
        //         console.log('关键字：' + key);
        //         console.log(e[key]);
        //     }
        // }
        const key = e._dispatchInstances.key;
        // 深拷贝 
        let newBrush = JSON.parse(JSON.stringify(this.state));
        newBrush.sketchpad.type = key;
        this.props.brushChoosedCallback(newBrush); 
    }

    // 改变画笔粗细
    // 改变画笔颜色
    // 改变画笔形状
    // 改变文本大小
    sketchpadChoosed(name, e) {
        e.stopPropagation();
        const value = e._dispatchInstances[0].key;
        if (!value || value == '') return;
        // 深拷贝 
        let newBrush = JSON.parse(JSON.stringify(this.state));
        newBrush.sketchpad[name] = value;
        this.props.sketchpadChoosedCallback(newBrush);
    }

    // 画笔粗细模板
    penSizeTemplate(name, index) {
        let item = this.penConfig[name].map((value) => {
            return <div key={value} className={`penSizeBox ${this.state.sketchpad[name] == value ? 'active' : ''}`} onClick={this.sketchpadChoosed.bind(this, 'penSize')}>
                <div className='penSize' data-value={value} style={{ width: `${value}px`, height: `${value}px` }}></div>
            </div>
        })
        return <div className='AttrBox' key={`${name}${index}`}> {item} </div>
    }

    // 画笔颜色模板
    penColorTemplate(name, index) {
        let item = this.penConfig[name].map((value, index) => {
            return <div key={value} className={`penColorBox ${this.state.sketchpad[name] == value ? 'active' : ''}`} onClick={this.sketchpadChoosed.bind(this, 'penColor')}>
                <div className='penColor' data-value={value} style={{ backgroundColor: `${value}` }} ></div>
            </div>
        })
        return <div className='AttrBox' key={`${name}${index}`}> {item} </div>
    }

    // 画笔文本模板
    textSizeTemplate(name, index) {
        let item = this.penConfig[name].map((value) => {
            return <div key={value} className={`textSizeBox ${this.state.sketchpad[name] == value ? 'active' : ''}`} onClick={this.sketchpadChoosed.bind(this, 'textSize')}>
                <div className='textSize' data-value={value}>{value}</div>
            </div>
        })
        return <div className='AttrBox' key={`${name}${index}`}> {item} </div>
    }

    // 画笔形状模板
    penShapeTemplate(name, index) {
        let shapeImg = this.penConfig.shapeImg;
        let item = this.penConfig[name].map((value) => {
            return <div key={value} className={`penShapeBox ${this.state.sketchpad[name] == value ? 'active' : ''}`} onClick={this.sketchpadChoosed.bind(this, 'penShape')}>
                <img style={{ display: `${shapeImg[value] ? 'block' : 'none'}` }} className={`penShape ${value}`} data-value={value} src={`${shapeImg[value]}`} />
            </div>
        })
        return <div className='AttrBox' key={`${name}${index}`}> {item} </div>
    }

    // 属性组装机
    toolAttrDom(attr, index) {
        if (attr) return attr.map((value) => this[`${value}Template`](value, index));
    }
    render() {
        this.state = this.props.state;
        
        const itmes = this.tools.map((value, index) => {
            return <div className='tool' key={value.type} data-type={value.type} onClick={this.brushChoosed.bind(this)}>
                <div className={`${value.type == this.state.sketchpad.type ? 'active' : ''}`}>
                    <img src={`${value.imgLink ? value.imgLink : ''}`}></img>
                </div>
                <div id='toolAttr' className='toolAttr' style={{ display: `${value.type == this.state.sketchpad.type && value.attrStyle ? 'block' : 'none'}`, height: `${value.attrStyle ? value.attrStyle.height : '0'}` }}>
                    {this.toolAttrDom(value.attr, index)}
                </div>
            </div>
        })

        return (<div className='drag' style={{ display: `${this.state.show ? 'flex' : 'none'}` }} >
                {itmes}
            </div>);
    }
}

export default BrushBox;
