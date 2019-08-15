/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-08-15 17:39:52
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import PropTypes from 'prop-types'
import './index.css';

import Sketchpad from '../../containers/sketchpad';

import compar169 from '../../untils/compar169';
const { width, height } = { ...compar169() };

const WhiteBoard = () => (
  <div id="whiteBoard" className="whiteBoard" style={{ width: `${width}`, height: `${height}` }}>
    <Sketchpad />

  </div >
)

export default WhiteBoard;