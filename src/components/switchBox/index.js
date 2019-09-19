/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 10:03:58
 * @LastEditTime: 2019-09-19 15:35:20
 * @LastEditors: Please set LastEditors
 */
import React from 'react'
import './index.css';
import SignalData from '../../depend/agoraSingal/SignalData';

class SwitchBox extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    const { switchToolbar, changePenSize, changePenColor, changeTextSize, changePenShape, addPath, addText, addGraph, removeCreated, reduceToolbar, childMessageBox } = { ...this.props };
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
        window.canvas.clear()
        reduceToolbar();

        window.coursewareCurPage = nextProps.switchBox.curPage;
        window.whiteBoardMessage.sendMessage("child", JSON.stringify({ type: "SWITCHBOX_GO_HANDLE_KEYDOWN", handleData: { page: window.coursewareCurPage } }));

        // 切换页面缓存操作
        if (window.PAGE_database) {
          window.BOARD_database.iterate(v => {
            if (v.curPage == window.coursewareCurPage) {
              SignalData.playback = true;
              switch (v.type) {
                case "BOARD_SWITCH_TOOLBAR":
                  switchToolbar({ ...v })
                  break;
                case "BOARD_CHANGE_PENSIZE":
                  changePenSize({ ...v })
                  break;
                case "BOARD_CHANGE_PENCOLOR":
                  changePenColor({ ...v })
                  break;
                case "BOARD_CHANGE_TEXTSIZE":
                  changeTextSize({ ...v })
                  break;
                case "BOARD_CHANGE_PENSHAPE":
                  changePenShape({ ...v })
                  break;
                case "BOARD_ADD_PATH":
                  addPath({ ...v })
                  break;
                case "BOARD_ADD_GRAPH":
                  addGraph({ ...v })
                  break;
                case "BOARD_ADD_TEXT":
                  addText({ ...v })
                  break;
                case "BOARD_REMOVE_CREATED":
                  removeCreated({ ...v })
                  break;
                case "CHILD_MESSAGE_BOX":
                  // 小游戏不回放
                  if (!v.data.type.includes("GAME_")) {
                    childMessageBox({ ...v })
                  }
                  break;
                default:
                  break;
              }
            }
          }).then(() => { })
        }

      }

      return true;
    }
  }

  goChooseDown(e) {
    const { switchBox, goHandleKeydown } = { ...this.props };
    let eventObj = e.nativeEvent;
    switch (true) {
      case eventObj.code.includes("Backspace"):
      case eventObj.code.includes("Enter"):
        goHandleKeydown({
          ...switchBox,
          toPage:switchBox.toPage,
          code: eventObj.code,
        });
        break;
      case eventObj.code.includes('Digit'):
        goHandleKeydown({
          ...switchBox,
          toPage: switchBox.toPage + eventObj.code.slice(5, 6),
          code: eventObj.code,
        });
        break;
      default:
        break;
    }
  }

  goHandleChange() { }

  goHandleFocus() {
    const { switchBox, goHandleKeydown } = { ...this.props };
    goHandleKeydown({
      ...switchBox,
      code: "Focus",
    });
  }

  // 上一页中间函数
  goPrevMiddle() {
    const { switchBox, goHandleKeydown } = { ...this.props };

    if (switchBox.curPage > 1) {
      let newPage = switchBox.curPage - 1;
      goHandleKeydown({
        ...switchBox,
        code: "left",
        toPage: newPage + "" 
      });
    }
  }

  // 下一页中间函数
  goNextMiddle() {
    const { switchBox, goHandleKeydown } = { ...this.props };

    if (switchBox.curPage < switchBox.totalPage) {
      let newPage = switchBox.curPage + 1;
      goHandleKeydown({
        ...switchBox,
        code: "right",
        toPage: newPage + "" 
      });
    }
  }

  render() {
    const { switchBox, fullscreen } = { ...this.props };
    return <div id="switchBox" className='switchBox' style={{ display: `${switchBox.show ? 'flex' : 'none'}` }}>

      <div onClick={() => this.goPrevMiddle()}>
        <img className="leftIcon" key='leftIcon' src='https://res.miaocode.com/livePlatform/soundNetwork/images/10double.png' />
      </div>

      <div onKeyDown={this.goChooseDown.bind(this)}>
        <input className='towardsPage' type='text' maxLength='2' value={switchBox.toPage} onChange={this.goHandleChange} onFocus={this.goHandleFocus.bind(this)} />
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