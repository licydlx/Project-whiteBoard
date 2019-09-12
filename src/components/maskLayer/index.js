/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-09-11 11:50:59
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import './index.css';

class MaskLayer extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.maskLayer == this.props.maskLayer) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return <div id="maskLayer" className="maskLayer" style={{ zIndex: this.props.maskLayer.zIndex }}>
    </div >
  }
}

export default MaskLayer;