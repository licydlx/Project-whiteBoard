/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:29:50
 * @LastEditTime: 2019-08-14 15:33:05
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import './App.css';

import AgoraSingal from './agoraSingal/index';
import Sketchpad from '../containers/sketchpad';

const App = () => (
  <div style={{ width: "100%", height: "100%" }}>
    <Sketchpad />
    {/* <AgoraSingal /> */}
  </div>
)

export default App;