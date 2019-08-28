/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-08-28 18:19:57
 * @LastEditors: Please set LastEditors
 */

import defaultState from './switchBoxState'

const switchBox = (state = defaultState, action) => {
  let newPage;
  switch (action.type) {
    // 切换显示状态
    case 'SWITCHBOX_SHOW_SWITCHBAR':
      return { ...state, show: action.show ? false : true }

    // 上一页
    case 'SWITCHBOX_GO_PREVPAGE':
      newPage = action.page > 1 ? action.page - 1 : action.page
      return { ...state, curPage: newPage, toPage: newPage + "" }

    // 下一页
    case 'SWITCHBOX_GO_NEXTPAGE':
      newPage = action.page < state.totalPage ? action.page + 1 : action.page;
      return { ...state, curPage: newPage, toPage: newPage + "" }

    // 键盘侠
    case 'SWITCHBOX_GO_HANDLE_KEYDOWN':
      switch (action.code) {
        case "Enter":
          if(parseInt(state.toPage) < action.totalPage + 1 && parseInt(state.toPage) > 0){
            return { ...state, prevPage: state.curPage, curPage: parseInt(state.toPage) }
          } else {
            return state;
          }
          
        case "Backspace":
          // delete 键盘删去
          return { ...state, toPage: action.toPage.slice(0, -1) }
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
