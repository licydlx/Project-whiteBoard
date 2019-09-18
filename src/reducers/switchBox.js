/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-09-18 15:38:43
 * @LastEditors: Please set LastEditors
 */

import defaultState from './switchBoxState'

const switchBox = (state = defaultState, action) => {
  let newPage;
  switch (action.type) {
    // 切换显示状态
    case 'SWITCHBOX_SHOW_SWITCHBAR':
      return { ...state, show: action.show ? false : true }

    // 值初始化
    case 'SWITCHBOX_GO_DEFAULT_VALUE':
      return { ...state, ...defaultState };

    // 上一页
    case 'SWITCHBOX_GO_PREVPAGE':
      newPage = state.curPage > 1 ? state.curPage - 1 : state.curPage;
      return { ...state, curPage: newPage, toPage: newPage + "" }

    // 下一页
    case 'SWITCHBOX_GO_NEXTPAGE':
      newPage = state.curPage < state.totalPage ? state.curPage + 1 : state.curPage;
      return { ...state, curPage: newPage, toPage: newPage + "" }

    // 键盘侠
    case 'SWITCHBOX_GO_HANDLE_KEYDOWN':
      switch (action.code) {
        case "Enter":
          if (parseInt(state.toPage) < action.totalPage + 1 && parseInt(state.toPage) > 0) {
            return { ...state, prevPage: state.curPage, curPage: parseInt(state.toPage) }
          } else {
            return state;
          }

        case "Backspace":
          // delete 键盘删去
          return { ...state, toPage: action.toPage.slice(0, -1) }

        case "Focus":
          // focus 清空 
          return { ...state, toPage: ""}
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
