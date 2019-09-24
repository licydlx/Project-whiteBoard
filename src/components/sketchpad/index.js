/* eslint-disable no-unused-vars */
/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-09-24 10:13:49
 * @LastEditors: Please set LastEditors
 */

import React from 'react';
import './index.css';
import SketchpadConfig from './sketchpadConfig/index';
import SketchpadBoard from './sketchpadBoard/index';
import UiConfig from './index.json';

class Sketchpad extends React.Component {
  constructor(props) {
    super(props);

    this.dragObj = {};
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.sketchpad == this.props.sketchpad) {
      return false;
    } else {
      return true;
    }
  }

  handleDragStart(event) {
    if (Object.is(event.currentTarget.id, "brushBox")) {
      this.dragObj.offsetX = event.pageX;
      this.dragObj.offsetY = event.pageY;
    }
  }

  handleDrag(event) {
    event.preventDefault();
  }

  handleDragEnd(event) {
    event.preventDefault();
    const { sketchpad, changePositionToolbar } = { ...this.props };
    if (Object.is(event.currentTarget.id, "brushBox")) {
      let x = event.pageX;
      let y = event.pageY;
      x -= this.dragObj.offsetX;
      y -= this.dragObj.offsetY;
      let ox = parseInt(sketchpad.position.right);
      let oy = parseInt(sketchpad.position.top);

      changePositionToolbar({
        top: y + oy + 'px',
        right: -x + ox + 'px',
      })

    }
  }

  handleDragEnter(event) {
    event.preventDefault();
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDragLeave(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
  }

  render() {
    const { sketchpad, switchToolbar, toggleToolbar, changePenSize, changePenColor, changeTextSize, changePenShape, changeSize } = { ...this.props };
    return <div id="sketchpadBox" className="sketchpadBox">

      <div id="brushBox" className='brushBox' style={{
        visibility: `${sketchpad.show ? "visible" : "hidden"}`, right: sketchpad.position.right, top: sketchpad.position.top,
        height: sketchpad.toggle ? "266px" : "46px", overflow: sketchpad.toggle ? "visible" : "hidden",zIndex:sketchpad.zIndex + 1
      }}
        draggable="true" onDrag={this.handleDrag.bind(this)} onDragStart={this.handleDragStart.bind(this)} onDragOver={this.handleDragOver.bind(this)}
        onDragEnd={this.handleDragEnd.bind(this)} onDrop={this.handleDrop.bind(this)} onDragEnter={this.handleDragEnter.bind(this)} onDragLeave={this.handleDragLeave.bind(this)}>
        {sketchpad.tools.map((v, i) => {
          return <div className={`tool ${v.active ? 'active' : ''}`} key={v.name}>
            <div className={`icon`} onClick={() => i ? switchToolbar({ name: v.name }) : toggleToolbar()}>
              <img src={UiConfig[v.name].imgLink} title={v.title}></img>
            </div>
            <SketchpadConfig config={v} changePenSize={changePenSize} changePenColor={changePenColor} changeTextSize={changeTextSize} changePenShape={changePenShape} />
          </div>
        })}
      </div>

      <SketchpadBoard zIndex={sketchpad.zIndex} tools={sketchpad.tools} boardData={sketchpad.boardData} changeBoard={changeSize} />
    </div >
  }
}

export default Sketchpad;