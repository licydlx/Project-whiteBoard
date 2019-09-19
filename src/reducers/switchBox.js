/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-09-19 15:01:04
 * @LastEditors: Please set LastEditors
 */

import defaultState from './switchBoxState'
import SignalData from '../depend/agoraSingal/SignalData'

const switchBox = (state = defaultState, action) => {
  switch (action.type) {
    // 切换显示状态
    case 'SWITCHBOX_SHOW_SWITCHBAR':
      return { ...state, show: action.show ? false : true }

    // 值初始化
    case 'SWITCHBOX_GO_DEFAULT_VALUE':
      switch (SignalData.role) {
        case 0:
          return { ...state, ...defaultState, show: true };
        case 2:
          return { ...state, ...defaultState, show: false };
      }
      return state;


    // 键盘侠
    case 'SWITCHBOX_GO_HANDLE_KEYDOWN':
      switch (action.code) {
        case "Enter":
          if (parseInt(action.toPage) < state.totalPage + 1 && parseInt(action.toPage) > 0) {
            return { ...state, prevPage: state.curPage, curPage: parseInt(action.toPage), toPage: action.toPage }
          } else {
            return state;
          }

        case "Backspace":
          // delete 键盘删去
          return { ...state, toPage: action.toPage.slice(0, -1) }

        case "Focus":
          // focus 清空 
          return { ...state, toPage: "" }

        case "left":
          // 上一页 
          return { ...state, ...action, prevPage: state.curPage, curPage: parseInt(action.toPage) }

        case "right":
          // 下一页 
          return { ...state, ...action, prevPage: state.curPage, curPage: parseInt(action.toPage) }

        default:
          return { ...state, toPage: action.toPage }
      }

    // 设置总页数
    case 'SWITCHBOX_SET_TOTAL_PAGE':
      return { ...state, totalPage: action.totalPage }

    // 全屏
    case 'SWITCHBOX_FULL_SCREEN':
      return { ...state, fullScreen: state.fullScreen ? false : true }

    default:
      return state
  }
}

export default switchBox
