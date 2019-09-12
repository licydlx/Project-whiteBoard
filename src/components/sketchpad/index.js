/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-09-12 09:27:25
 * @LastEditors: Please set LastEditors
 */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import './index.css';

// eslint-disable-next-line no-unused-vars
import SketchpadConfig from './sketchpadConfig/index';
// eslint-disable-next-line no-unused-vars
import SketchpadBoard from './sketchpadBoard/index';
import UiConfig from './index.json';

const Sketchpad = ({ sketchpad, switchToolbar, changePenSize, changePenColor, changeTextSize, changePenShape, changeSize }) => (
  <div id="sketchpadBox" className="sketchpadBox">
    <div className='drag' style={{visibility:`${sketchpad.show ? "visible" : "hidden"}`}} >
      {sketchpad.tools.map((v) => {
        return <div className={`tool ${v.active ? 'active' : ''}`} key={v.name}>
          <div className={`icon`} onClick={() => switchToolbar({name:v.name})}>
            <img src={UiConfig[v.name].imgLink}></img>
          </div>
          <SketchpadConfig config={v} changePenSize={changePenSize} changePenColor={changePenColor} changeTextSize={changeTextSize} changePenShape={changePenShape} />
        </div>
      })}
    </div>

    <SketchpadBoard tools={sketchpad.tools} boardData = {sketchpad.boardData} changeBoard={changeSize} />
  </div >
)

export default Sketchpad;