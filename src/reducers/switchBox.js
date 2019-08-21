/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-08-21 10:51:45
 * @LastEditors: Please set LastEditors
 */

import defaultState from './switchBoxState'

const switchBox = (state = defaultState, action) => {
  switch (action.type) {
    // 切换显示，隐藏状态
    case 'TOGGLE_SWICHBOX':
      return { ...state, show: action.show ? false : true }

    // 上一页
    case 'GO_PREVPAGE':
      return { ...state, curPage: action.page > 1 ? action.page - 1 : action.page }

    // 下一页
    case 'GO_NEXTPAGE':
      return { ...state, curPage: action.page < state.totalPage ? action.page + 1 : action.page }

    // 键盘侠
    case 'GO_HANDLE_KEYDOWN':
      let eventObj = action.e.nativeEvent;
      switch (eventObj.keyCode) {
        case 13:
          // enter 确定
          let toPage = parseInt(state.toPage);
          let nextPage = state.totalPage > toPage ? toPage + 1 : toPage;
          return { ...state, prevPage: state.curPage, curPage: toPage, nextPage: nextPage }
        case 8:
          // delete 键盘删去
          return { ...state, toPage: state.toPage.slice(0, -1) }
        default:
          if (eventObj.keyCode >= 49 && eventObj.keyCode <= 57) {
            return { ...state, toPage: state.toPage + eventObj.key }
          } else {
            return state
          }
      }
    
    // 全屏
    case 'FULL_SCREEN':
      return { ...state, fullScreen: state.fullScreen ? false : true }
    
    default:
      return state
  }
}

export default switchBox
