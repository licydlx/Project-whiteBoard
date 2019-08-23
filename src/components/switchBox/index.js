/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-08-22 19:58:28
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import PropTypes from 'prop-types'
import './index.css';

class SwitchBox extends React.Component {
  constructor(props) {
    super(props);
  }

  goChooseDown(e) {
    const {switchBox, goHandleKeydown} = { ...this.props };
    const eventObj = e.nativeEvent;
    goHandleKeydown(switchBox.toPage,switchBox.totalPage,eventObj.keyCode,eventObj.key);
  }

  goHandleChange(e) {}

  render() {
    const { switchBox, goPrevPage, goNextPage, fullscreen } = { ...this.props };
    return <div id="switchBox" className='switchBox' style={{ display: `${switchBox.show ? 'flex' : 'none'}` }}>

      <div onClick={() => goPrevPage(switchBox.curPage)}>
        <img className="leftIcon" key='leftIcon' src='https://res.miaocode.com/livePlatform/soundNetwork/images/10double.png' />
      </div>

      <div onKeyDown={this.goChooseDown.bind(this)}>
        <input className='towardsPage' type='text' maxLength='2' value={switchBox.curPage} onChange={this.goHandleChange} />
      </div>

      <div className='totalPage'>/{switchBox.totalPage} </div>

      <div onClick={() => goNextPage(switchBox.curPage, switchBox.totalPage)}>
        <img className="rightIcon" key='rightIcon' src='https://res.miaocode.com/livePlatform/soundNetwork/images/11double.png' />
      </div>

      <div onClick={() => fullscreen(switchBox.fullScreen)}>
        <img className="fullscreen" src={`https://res.miaocode.com/livePlatform/soundNetwork/images/${switchBox.fullScreen ? '09' : '08'}double.png`} />
      </div>

    </div>
  }
}

// const SwitchBox = ({ switchBox, goPrevPage, goHandleKeydown, goNextPage, fullscreen }) => (
//   <div id="switchBox" className='switchBox' style={{ display: `${switchBox.show ? 'flex' : 'none'}` }}>

//     <div onClick={() => goPrevPage(switchBox.curPage)}>
//       <img className="leftIcon" key='leftIcon' src='https://res.miaocode.com/livePlatform/soundNetwork/images/10double.png' />
//     </div>

//     <div onKeyDown={goChooseDown}>
//       <input className='towardsPage' type='text' maxLength='2' value={switchBox.toPage} onChange={goHandleChange.bind(this)} />
//     </div>

//     <div className='totalPage'>/{switchBox.totalPage} </div>

//     <div onClick={() => goNextPage(switchBox.curPage,switchBox.totalPage)}>
//       <img className="rightIcon" key='rightIcon' src='https://res.miaocode.com/livePlatform/soundNetwork/images/11double.png' />
//     </div>

//     <div onClick={() => fullscreen()}>
//       <img className="fullscreen" src={`https://res.miaocode.com/livePlatform/soundNetwork/images/${switchBox.fullScreen ? '09' : '08'}double.png`} />
//     </div>

//   </div>
// )

export default SwitchBox;