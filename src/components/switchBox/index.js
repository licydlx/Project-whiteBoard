/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-09-10 18:34:50
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import PropTypes from 'prop-types'
import './index.css';
import SignalData from '../../depend/agoraSingal/SignalData';

class SwitchBox extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { switchToolbar, changePenSize, changePenColor, changeTextSize, changePenShape, addPath, addText, addGraph, removeCreated, reduceToolbar,childMessageBox } = { ...this.props };

    if (this.props.switchBox == nextProps.switchBox) {
      return false;
    } else {
      if (this.props.switchBox.fullScreen !== nextProps.switchBox.fullScreen) {
        let data = this.props.switchBox.fullScreen ? 'miniWhiteboard' : 'maxWhiteboard';
        if (window !== window.parent) window.parent.postMessage(data, '*');
        if (window.webkit) window.webkit.messageHandlers[data].postMessage(data);
      }

      if (this.props.switchBox.curPage !== nextProps.switchBox.curPage) {
        // 清空画板
        canvas.clear()
        reduceToolbar();
        coursewareCurPage = nextProps.switchBox.curPage;
        whiteBoardMessage.sendMessage("child", JSON.stringify({ type: "SWITCHBOX_GO_HANDLE_KEYDOWN", handleData: { page: coursewareCurPage } }));

        // 切换页面缓存操作
        if (PAGE_database) {
          BOARD_database.iterate(v => {
            if (v.curPage == coursewareCurPage) {
              SignalData.playback = true;
              switch (v.type) {
                case "BOARD_SWITCH_TOOLBAR":
                  switchToolbar({...v})
                  break;
                case "BOARD_CHANGE_PENSIZE":
                  changePenSize({...v})
                  break;
                case "BOARD_CHANGE_PENCOLOR":
                  changePenColor({...v})
                  break;
                case "BOARD_CHANGE_TEXTSIZE":
                  changeTextSize({...v})
                  break;
                case "BOARD_CHANGE_PENSHAPE":
                  changePenShape({...v})
                  break;
                case "BOARD_ADD_PATH":
                  addPath({...v})
                  break;
                case "BOARD_ADD_GRAPH":
                  addGraph({...v})
                  break;
                case "BOARD_ADD_TEXT":
                  addText({...v})
                  break;
                case "BOARD_REMOVE_CREATED":
                  removeCreated({...v})
                  break;
                case "CHILD_MESSAGE_BOX":
                  childMessageBox({...v})
                  break;
                default:
                  break;
              }
            }
          }).then((data) => { })
        }

      }

      return true;
    }
  }

  componentDidUpdate(prevProps, prevState) {
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

  // 上一页中间函数
  goPrevMiddle() {
    const { switchBox, goPrevPage } = { ...this.props };
    if (switchBox.curPage === 1) return;
    goPrevPage({
      page: switchBox.curPage,
    })
  }

  // 下一页中间函数
  goNextMiddle() {
    const { switchBox, goNextPage } = { ...this.props };
    if (switchBox.curPage === switchBox.totalPage) return;
    goNextPage({
      page: switchBox.curPage,
      totalPage: switchBox.totalPage
    });
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

export default SwitchBox;