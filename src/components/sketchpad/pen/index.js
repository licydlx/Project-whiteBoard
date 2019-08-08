import React from 'react'
import PropTypes from 'prop-types'
import './index.css';

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
const penSizeTemplate = (config, name) => {
  return config[name].map((value) => {
    return <div key={value} className={`${name}Box`} >
      <div className={name} style={{ width: `${value}px`, height: `${value}px` }}></div>
    </div>
  })
}

// 画笔颜色模板
const penColorTemplate = (config, name) => {
  return config[name].map((value, index) => {
    return <div key={value} className={`${name}Box`} >
      <div className={name} style={{ backgroundColor: `${value}` }} ></div>
    </div>
  })
}

const sketchpadPen = () => (
  <div className='attrWrapper'>
    <div className='attrBox'>
      {penSizeTemplate(penConfig, 'penSize')}
    </div>
    <div className='attrBox'>
      {penColorTemplate(penConfig, 'penColor')}
    </div>
  </div>
)

export default sketchpadPen;