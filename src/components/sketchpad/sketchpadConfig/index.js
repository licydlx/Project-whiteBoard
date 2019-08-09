import React from 'react'
import PropTypes from 'prop-types'
import './index.css';

const penConfig = {
  penSize: {
    style: { width: "120px" },
    value: [2, 4, 6, 12]
  },
  penColor: {
    value: ['#fff', '#9b9b9b', '#2e3038', '#000', '#fd2c0a', '#ff6e00', '#ffd400', '#98cd46', '#00d7d1', '#0097f0', '#8b6dc2', '#ff9b9e'],
  },
  textSize: {
    value: ['14', '18', '24', '36'],
  },
  penShape: {
    value: ['line', 'ellipse', 'rectangle', ''],
  },
  shapeImg: {
    'line': 'https://res.miaocode.com/livePlatform/soundNetwork/images/pathdouble.png',
    'ellipse': 'https://res.miaocode.com/livePlatform/soundNetwork/images/ovaldouble.png',
    'rectangle': 'https://res.miaocode.com/livePlatform/soundNetwork/images/rectangledouble.png',
  }
};

const defaultConfig = {
  pen: {
    attr: ['penSize', 'penColor']
  },
}

// 画笔粗细模板
// 画笔颜色模板
const uiTemplate = (name) => {
  penConfig[name].value.map(v => {
    let style;
    switch (name) {
      case 'penSize':
        style = `width: ${v.style.width}px, height: ${v.style.width}px`
        break;
      case 'penColor':
        style = `backgroundColor:${v}`
        break;
      default:
        break;
    }
    return <div className={`${v}Box`}>
      <div className={name} style={style}></div>
    </div>
  })
}

const createAttrBox = (name) => (
  <div className='attrWrapper'>
    {defaultConfig[name].attr.map((v) => {
      return <div key={v} className='attrBox'>

      </div>
    })}
  </div>
)

const sketchpadConfig = (pars) => {
  if (defaultConfig[pars.name]) {
    return createAttrBox(pars.name)
  } else {
    return <div></div>;
  }
}

export default sketchpadConfig;