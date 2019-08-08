import React from 'react'
import PropTypes from 'prop-types'
import './index.css';
import SketchpadPen from './pen/index';

const tools = [
  {
    type: 'board',
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
    type: 'eraser',
    imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/06double.png',
  },
  {
    type: 'empty',
    imgLink: 'https://res.miaocode.com/livePlatform/soundNetwork/images/05double.png',
  },
];

    const penConfig = {
      penSize: [2, 4, 6, 12],
      penColor: ['#fff', '#9b9b9b', '#2e3038', '#000', '#fd2c0a', '#ff6e00', '#ffd400', '#98cd46', '#00d7d1', '#0097f0', '#8b6dc2', '#ff9b9e'],
      textSize: ['14', '18', '24', '36'],
      penShape: ['line', 'ellipse', 'rectangle', ''],
      shapeImg: {
        'line': 'https://res.miaocode.com/livePlatform/soundNetwork/images/pathdouble.png',
        'ellipse': 'https://res.miaocode.com/livePlatform/soundNetwork/images/ovaldouble.png',
        'rectangle': 'https://res.miaocode.com/livePlatform/soundNetwork/images/rectangledouble.png',
      }
    };

// 画笔粗细模板
const penSizeTemplate = (name, index) => {
  let item = penConfig[name].map((value) => {
    return <div key={value} className={`penSizeBox ${this.state.sketchpad[name] == value ? 'active' : ''}`} onClick={this.sketchpadChoosed.bind(this, 'penSize')}>
      <div className='penSize' data-value={value} style={{ width: `${value}px`, height: `${value}px` }}></div>
    </div>
  })
  return <div className='AttrBox' key={`${name}${index}`}> {item} </div>
}

// 画笔颜色模板
const penColorTemplate = (name, index) => {
  let item = penConfig[name].map((value, index) => {
    return <div key={value} className={`penColorBox ${this.state.sketchpad[name] == value ? 'active' : ''}`} onClick={this.sketchpadChoosed.bind(this, 'penColor')}>
      <div className='penColor' data-value={value} style={{ backgroundColor: `${value}` }} ></div>
    </div>
  })
  return <div className='AttrBox' key={`${name}${index}`}> {item} </div>
}

// 画笔文本模板
const textSizeTemplate = (name, index) => {
  let item = penConfig[name].map((value) => {
    return <div key={value} className={`textSizeBox ${this.state.sketchpad[name] == value ? 'active' : ''}`} onClick={this.sketchpadChoosed.bind(this, 'textSize')}>
      <div className='textSize' data-value={value}>{value}</div>
    </div>
  })
  return <div className='AttrBox' key={`${name}${index}`}> {item} </div>
}

// 画笔形状模板
const penShapeTemplate = (name, index) => {
  let shapeImg = penConfig.shapeImg;
  let item = penConfig[name].map((value) => {
    return <div key={value} className={`penShapeBox ${this.state.sketchpad[name] == value ? 'active' : ''}`} onClick={this.sketchpadChoosed.bind(this, 'penShape')}>
      <img style={{ display: `${shapeImg[value] ? 'block' : 'none'}` }} className={`penShape ${value}`} data-value={value} src={`${shapeImg[value]}`} />
    </div>
  })
  return <div className='AttrBox' key={`${name}${index}`}> {item} </div>
}

// 属性组装机
const toolAttrDom = (attr, index) => {
  if (attr) return attr.map((value) => this[`${value}Template`](value, index));
}

const itmes = tools.map((value, index) => {

  return <div className='tool' key={value.type} data-type={value.type}>

    <div className='active'>
      <img src={`${value.imgLink ? value.imgLink : ''}`}></img>
    </div>

    <SketchpadPen />

  </div>
})

const Sketchpad = ({ onClick, completed, text }) => (
  <div className='drag'>
    {itmes}
  </div>
)

export default Sketchpad;