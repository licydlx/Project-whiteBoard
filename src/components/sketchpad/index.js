/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-08-13 18:36:14
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

  }

  render() {
    let { sketchpad, toggleSketchpad, changePenSize, changePenColor, changeTextSize, changePenShape ,changeBoard} = {...this.props};

    console.log(sketchpad)
    return <div id="sketchpadBox" className="sketchpadBox">
        <div className='drag'>
          {sketchpad.tools.map((v) => {
            return <div className={`tool ${v.active ? 'active' : ''}`} key={v.name}>
              <div className={`icon`} onClick={() => toggleSketchpad(v.name)}>
                <img src={UiConfig[v.name].imgLink}></img>
              </div>
              <SketchpadConfig config={v} changePenSize={changePenSize} changePenColor={changePenColor} changeTextSize={changeTextSize} changePenShape={changePenShape} />
            </div>
          })}
        </div>
    
        <SketchpadBoard boardSize={sketchpad.boardSize} changeBoard={changeBoard}/>
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