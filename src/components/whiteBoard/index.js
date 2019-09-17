/* eslint-disable no-unused-vars */
/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-09-17 17:30:41
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import PropTypes from 'prop-types'
import './index.css';

import Sketchpad from '../../containers/sketchpad';
import SwitchBox from '../../containers/switchBox';
import Courseware from '../../containers/courseware';
import MaskLayer from '../../containers/maskLayer';

import ratio from '../../untils/ratio';
const { width, height} = { ...ratio(16/9) };

console.log(width);
console.log(height);
const WhiteBoard = () => (
  <div id="whiteBoard" className="whiteBoard" style={{ width: `${width}`, height: `${height}` }}>
    <Courseware />
    <Sketchpad />
    <SwitchBox />
    <MaskLayer />
  </div >
)

export default WhiteBoard;