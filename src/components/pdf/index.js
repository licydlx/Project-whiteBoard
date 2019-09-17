/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-17 15:08:50
 * @LastEditTime: 2019-09-17 16:41:46
 * @LastEditors: Please set LastEditors
 */

import React from 'react';
// eslint-disable-next-line no-unused-vars
import PDF from 'react-pdf-js';

class Demo extends React.Component {
  render() {
    let scale = 1000/720;
    return (
      <div>
        <PDF
          file="http://res.miaocode.com/livePlatform/pdf/wxmg.pdf"
          page={2}
          scale={scale}
        />
      </div>
    )
  }
}

export default Demo;
