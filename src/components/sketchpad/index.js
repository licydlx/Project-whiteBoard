/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-08-12 19:03:39
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import fabric from 'fabric';
import PropTypes from 'prop-types'
import './index.css';

import SketchpadConfig from './sketchpadConfig/index';
import SketchpadBoard from './sketchpadBoard/index';
import UiConfig from './index.json';


class Sketchpad extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    // 画板实例化
    window.sketchpadObj = new sketchpadEngine('sketchpadBoard');
  }

  render() {
    let { sketchpad, toggleSketchpad, changePenSize, changePenColor, changeTextSize, changePenShape } = {...this.props};
    return <div id="sketchpadBox" className="sketchpadBox">
        <div className='drag'>
          {sketchpad.map((v) => {
            return <div className={`tool ${v.active ? 'active' : ''}`} key={v.name}>
              <div className={`icon`} onClick={() => toggleSketchpad(v.name)}>
                <img src={UiConfig[v.name].imgLink}></img>
              </div>
              <SketchpadConfig config={v} changePenSize={changePenSize} changePenColor={changePenColor} changeTextSize={changeTextSize} changePenShape={changePenShape} />
            </div>
          })}
        </div>
    
        <SketchpadBoard />
      </div >
  }
}
// const Sketchpad = ({ sketchpad, toggleSketchpad, changePenSize, changePenColor, changeTextSize, changePenShape }) => (

//   <div id="sketchpadBox" className="sketchpadBox">
//     <div className='drag'>
//       {sketchpad.map((v) => {
//         return <div className={`tool ${v.active ? 'active' : ''}`} key={v.name}>
//           <div className={`icon`} onClick={() => toggleSketchpad(v.name)}>
//             <img src={UiConfig[v.name].imgLink}></img>
//           </div>
//           <SketchpadConfig config={v} changePenSize={changePenSize} changePenColor={changePenColor} changeTextSize={changeTextSize} changePenShape={changePenShape} />
//         </div>
//       })}
//     </div>

//     <SketchpadBoard />
//   </div >
// )

export default Sketchpad;