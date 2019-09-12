/* eslint-disable no-unused-vars */
/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-09-12 18:36:52
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import PropTypes from 'prop-types'
import './index.css';

import Sketchpad from '../../containers/sketchpad';
import SwitchBox from '../../containers/switchBox';
import Courseware from '../../containers/courseware';
import MaskLayer from '../../containers/maskLayer';

import compar169 from '../../untils/compar169';
const { width, height} = { ...compar169() };

const WhiteBoard = () => (
  <div id="whiteBoard" className="whiteBoard" style={{ width: `${width}`, height: `${height}` }}>
    <Courseware />
    <Sketchpad />
    <SwitchBox />
    <MaskLayer />
  </div >
)

export default WhiteBoard;