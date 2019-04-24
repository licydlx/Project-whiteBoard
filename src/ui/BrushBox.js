import React, { Component } from 'react';
import './BrushBox.css';
class BrushBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showBrush:this.props.showBrush,
            tools: this.props.tools,
            toolsCache: this.props.toolsCache,
            sketchpadConfig: this.props.sketchpadConfig,
            shapeImg: {
                'line': 'https://res.miaocode.com/livePlatform/soundNetwork/images/pathdouble.png',
                'ellipse': 'https://res.miaocode.com/livePlatform/soundNetwork/images/ovaldouble.png',
                'rectangle': 'https://res.miaocode.com/livePlatform/soundNetwork/images/rectangledouble.png',
            },
            position: this.props.position,
        }

        this.offsetX = null;
        this.offsetY = null;
        // == 被我们拖的元素（按住鼠标）
        // ondragstart - 用户开始拖动元素时触发
        // ondrag - 元素正在拖动时触发
        // ondragend - 用户完成元素拖动后触发
        // == 释放拖拽元素时触发的事件（松开鼠标）
        // ondragenter - 当被鼠标拖动的对象进入其容器范围内时触发此事件
        // ondragover - 当某被拖动的对象在另一对象容器范围内拖动时触发此事件
        // ondragleave - 当被鼠标拖动的对象离开其容器范围内时触发此事件
        // ondrop - 在一个拖动过程中，释放鼠标键时触发此事件
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleDragEnter = this.handleDragEnter.bind(this);
        this.handleDragLeave = this.handleDragLeave.bind(this);
    }
  
    handleDragStart(event) {
        this.offsetX = event.pageX;
        this.offsetY = event.pageY;
    }

    handleDrag(event) {
        // 阻止默认动作
        event.preventDefault();
    }

    handleDragEnd(event) {
        event.preventDefault();
        let x = event.pageX;
        let y = event.pageY;
        x -= this.offsetX;
        y -= this.offsetY;
        let ox = parseInt(this.state.position.right);
        let oy = parseInt(this.state.position.top);
        this.setState({
            position: {
                right: -x + ox + 'px',
                top: y + oy + 'px'
            }
        });
    }

    handleDragEnter(event) {
        event.preventDefault();
    }

    handleDragOver(event) {
        // 阻止默认动作以启用drop
        event.preventDefault();
    }

    handleDragLeave(event) {
        event.preventDefault();
    }

    handleDrop(event) {
        event.preventDefault();
    }

    // 画板参数变化
    sketchpadChange(pars){
        this.props.sketchpadChange(pars,true);
    }

    childCallback(pars){
        this.props.childCallback(pars);
    }

    broadcastMessage(belong, method, context, pars){ // 此处使用箭头函数，避免bind绑定
        this.props.broadcastMessage(belong, method, context, pars);
    }

    // 工具被选中
    toolChoosed(e) {
        e.preventDefault();
        // 设置新值
        // for (const key in e) {
        //     if (e.hasOwnProperty(key)) {
        //         console.log('关键字：' + key);
        //         console.log(e[key]);
        //     }
        // }
        const key = e._dispatchInstances.key;
        const index = e._dispatchInstances.index;
        const toolsArray = this.state.tools;
        let newToolsArray;
        switch (key) {
            case 'toolsBox':
                toolsArray[index].expand = toolsArray[index].expand ? false : true;
                newToolsArray = toolsArray;
                break;
            case 'sketchpad':
            case 'pen':
            case 'text':
            case 'graph':
            case 'remove':
            case 'empty':    
                newToolsArray = toolsArray.map(function(m,n,arr){
                    if(n == index){
                        arr[n].state = arr[n].state ? false : true;
                    } else {
                        arr[n].state = false;
                    }
                    return m;
                }) 
                break;       
            default:
                break;
        }
        // 信令通信
        let pars =  {
            type:key,
            index:index
        }   

        this.childCallback(pars);
        this.broadcastMessage('whiteboard', 'handleClick', null, pars);
        this.setState({ tools: newToolsArray });
    }

    // 改变画笔粗细
    // 改变画笔颜色
    // 改变画笔形状
    // 改变文本大小
    changeSketchpadConfig(name, e) {
        e.stopPropagation();
        const value = e._dispatchInstances[0].key;
        if (!value || value == '') return;
        let sketchpadConfig = this.state.sketchpadConfig;
        sketchpadConfig[name] = value;
        let pars = {
            type:name,
            value:value
        }
        this.sketchpadChange(pars);
        this.setState({ sketchpadConfig: sketchpadConfig });
    }

    // 画笔粗细模板
    penSizeTemplate(name, index, skconfig) {
        let item = [2, 4, 6, 12].map((value, index) => {
            return <div key={value} className={`penSizeBox ${skconfig[name] == value ? 'active' : ''}`} onClick={this.changeSketchpadConfig.bind(this, 'penSize')}>
                <div className='penSize' data-value={value} style={{ width: `${value}px`, height: `${value}px` }}></div>
            </div>
        })
        return <div className='AttrBox' key={`${name}${index}`}> {item} </div>
    }

    // 画笔颜色模板
    penColorTemplate(name, index, skconfig) {
        let item = ['#fff', '#9b9b9b', '#2e3038', '#000', '#fd2c0a', '#ff6e00', '#ffd400', '#98cd46', '#00d7d1', '#0097f0', '#8b6dc2', '#ff9b9e'].map((value, index) => {
            return <div key={value} className={`penColorBox ${skconfig[name] == value ? 'active' : ''}`} onClick={this.changeSketchpadConfig.bind(this, 'penColor')}>
                <div className='penColor' data-value={value} style={{ backgroundColor: `${value}` }} ></div>
            </div>
        })
        return <div className='AttrBox' key={`${name}${index}`}> {item} </div>
    }

    // 画笔文本模板
    textSizeTemplate(name, index, skconfig) {
        let item = ['14', '18', '24', '36'].map((value, index) => {
            return <div key={value} className={`textSizeBox ${skconfig[name] == value ? 'active' : ''}`} onClick={this.changeSketchpadConfig.bind(this, 'textSize')}>
                <div className='textSize' data-value={value}>{value}</div>
            </div>
        })
        return <div className='AttrBox' key={`${name}${index}`}> {item} </div>
    }

    // 画笔形状模板
    penShapeTemplate(name, index, skconfig) {
        let shapeImg = this.state.shapeImg;
        let item = ['line', 'ellipse', 'rectangle', ''].map((value, index) => {
            return <div key={value} className={`penShapeBox ${skconfig[name] == value ? 'active' : ''}`} onClick={this.changeSketchpadConfig.bind(this, 'penShape')}>
                <img style={{ display: `${shapeImg[value] ? 'block' : 'none'}` }} className={`penShape ${value}`} data-value={value} src={`${shapeImg[value]}`} />
            </div>
        })
        return <div className='AttrBox' key={`${name}${index}`}> {item} </div>
    }

    // 属性组装机
    toolAttrDom(attr, index, skconfig) {
        if (attr) return attr.map((value) => this[`${value}Template`](value, index, skconfig));
    }

    render() {
        const expand = this.state.tools[0].expand;
        const toolsArray = expand ? this.state.tools : [this.state.tools[0]];
        const sketchpadConfig = this.state.sketchpadConfig;
        const itmes = toolsArray.map((value, index) => {
            return <div className='tool' key={value.type} data-type={value.type} onClick={this.toolChoosed.bind(this)}>
                <div className={`${value.state ? 'active' : ''}`}>
                    <img src={`${value.imgLink ? value.imgLink : ''}`}></img>
                </div>
                <div id='toolAttr' className='toolAttr' style={{ display: `${value.state && value.attrStyle ? 'block' : 'none'}`, height: `${value.attrStyle ? value.attrStyle.height : '0'}` }}>
                    {this.toolAttrDom(value.attr, index, sketchpadConfig)}
                </div>
            </div >
        })

        return (<div className='drag' style={{ height: `${toolsArray.length == 1 ? '48px' : '312px'}`,display:`${this.props.showBrush ? 'flex' : 'none'}`,right:`${this.state.position.right}`,top:`${this.state.position.top}` }} draggable="true" onDrag={this.handleDrag} onDragStart={this.handleDragStart} onDragOver={this.handleDragOver} onDragEnd={this.handleDragEnd} onDrop={this.handleDrop} onDragEnter={this.handleDragEnter} onDragLeave={this.handleDragLeave}>
            {itmes}
        </div>
        );
    }
}

export default BrushBox;