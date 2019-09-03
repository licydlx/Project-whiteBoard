/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-08-30 18:49:25
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import PropTypes from 'prop-types'
import './index.css';

class SwitchBox extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState){
    window.coursewareCurPage = this.props.switchBox.curPage;
  }

  goChooseDown(e) {
    const { switchBox, goHandleKeydown } = { ...this.props };
    let eventObj = e.nativeEvent;
    switch (true) {
      case eventObj.code.includes("Backspace"):
      case eventObj.code.includes("Enter"):
          goHandleKeydown({
            toPage: switchBox.toPage,
            curPage: switchBox.curPage,
            prevPage: switchBox.prevPage,
            totalPage: switchBox.totalPage,
            code: eventObj.code,
          });
          break;
      case eventObj.code.includes('Digit'):
        goHandleKeydown({
          toPage: switchBox.toPage + eventObj.code.slice(5, 6),
          prevPage: switchBox.prevPage,
          totalPage: switchBox.totalPage,
          code: eventObj.code,
        });
        break;
      default:
          break;
    }
  }

  goHandleChange(e) { }

  goPrevMiddle() {
    const { switchBox, goPrevPage } = { ...this.props };

    if (switchBox.curPage === 1) return;
    const par = {
      page: switchBox.curPage,
    }
    goPrevPage(par)
  }

  goNextMiddle() {
    const { switchBox, goNextPage } = { ...this.props };

    if (switchBox.curPage === switchBox.totalPage) return;
    const par = {
      page: switchBox.curPage,
      totalPage: switchBox.totalPage
    }
    goNextPage(par);
  }

  render() {
    const { switchBox, fullscreen } = { ...this.props };
    return <div id="switchBox" className='switchBox' style={{ display: `${switchBox.show ? 'flex' : 'none'}` }}>

      <div onClick={() => this.goPrevMiddle()}>
        <img className="leftIcon" key='leftIcon' src='https://res.miaocode.com/livePlatform/soundNetwork/images/10double.png' />
      </div>

      <div onKeyDown={this.goChooseDown.bind(this)}>
        <input className='towardsPage' type='text' maxLength='2' value={switchBox.toPage} onChange={this.goHandleChange} />
      </div>

      <div className='totalPage'>/{switchBox.totalPage} </div>

      <div onClick={() => this.goNextMiddle()}>
        <img className="rightIcon" key='rightIcon' src='https://res.miaocode.com/livePlatform/soundNetwork/images/11double.png' />
      </div>

      <div onClick={() => fullscreen()}>
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