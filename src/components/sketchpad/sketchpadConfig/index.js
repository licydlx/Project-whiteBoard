/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 14:02:49
 * @LastEditTime: 2019-08-26 18:13:08
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import PropTypes from 'prop-types'
// import './index.css';

const penConfig = {
  penSize: {
    name: 'penSize',
    value: [2, 4, 6, 12]
  },
  penColor: {
    name: 'penColor',
    value: ['#fff', '#9b9b9b', '#2e3038', '#000', '#fd2c0a', '#ff6e00', '#ffd400', '#98cd46', '#00d7d1', '#0097f0', '#8b6dc2', '#ff9b9e'],
  },
  textSize: {
    name: 'textSize',
    value: ['14', '18', '24', '36'],
  },
  penShape: {
    name: 'penShape',
    value: ['line', 'ellipse', 'rectangle',''],
  },
  shapeImg: {
    'line': 'https://res.miaocode.com/livePlatform/soundNetwork/images/pathdouble.png',
    'ellipse': 'https://res.miaocode.com/livePlatform/soundNetwork/images/ovaldouble.png',
    'rectangle': 'https://res.miaocode.com/livePlatform/soundNetwork/images/rectangledouble.png',
  }
};

const defaultConfig = {
  board: {},
  pen: {
    attr: ['penSize', 'penColor']
  },
  text: {
    attr: ['textSize', 'penColor']
  },
  graph: {
    attr: ['penShape','penSize','penColor']
  },
  eraser:{},
  empty: {}
}

// 画笔粗细模板
// 画笔颜色模板
const uiTemplate = (pars, name) => (
  <div key={name} className='attrBox'>
    {penConfig[name].value.map((v, i) => {
      switch (name) {
        case 'penSize':
          return <div key={i} className={`${name}Box ${v == pars.config[name] ? 'active' : ''}`} onClick={() => pars.changePenSize({name:pars.config.name, penSize:v})}>
            <div className={name} style={{ width: `${v}px`, height: `${v}px` }}></div>
          </div>;

        case 'penColor':
          return <div key={i} className={`${name}Box ${v == pars.config[name] ? 'active' : ''}`} onClick={() => pars.changePenColor({name:pars.config.name, penColor:v})}>
            <div className={name} style={{ backgroundColor: `${v}` }}></div>
          </div>;

        case 'textSize':
            return <div key={i} className={`${name}Box ${v == pars.config[name] ? 'active' : ''}`} onClick={() => pars.changeTextSize({name:pars.config.name, textSize:v})}>
              <div className={name}>{v}</div>
            </div>;

        case 'penShape':
            return <div key={i} className={`${name}Box ${v == pars.config[name] ? 'active' : ''}`} onClick={() => pars.changePenShape({name:pars.config.name, penShape:v})}>
              <img className={name} style={{ display: `${penConfig.shapeImg[v] ? "block" : "none"}` }} src={`${penConfig.shapeImg[v]}`} />
            </div>;

        default:
          break;
      }
    })}
  </div>
)

const sketchpadConfig = (pars) => {
  let config = defaultConfig[pars.config.name];
  if (config && config.attr) {
    return <div className='attrWrapper'>
      {config.attr.map(v => {
        return uiTemplate(pars, v);
      })}
    </div>
  } else {
    return <div></div>;
  }
}

export default sketchpadConfig;