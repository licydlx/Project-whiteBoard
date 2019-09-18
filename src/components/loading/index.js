/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-17 15:08:50
 * @LastEditTime: 2019-09-18 17:03:33
 * @LastEditors: Please set LastEditors
 */
import React from 'react';
import './index.css';

class loading extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.loading == this.props.loading) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return <div className="loadingBox" style={{ visibility: `${this.props.loading.show ? "visible" : "hidden"}`}}>
      <div className="loading">
        <div className="loading-text">
          <span className="letter">L</span>
          <span className="letter">o</span>
          <span className="letter">a</span>
          <span className="letter">d</span>
          <span className="letter">i</span>
          <span className="letter">n</span>
          <span className="letter">g</span>
        </div>
      </div>
    </div>
  }
}

export default loading;
