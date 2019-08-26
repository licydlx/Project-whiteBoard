/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-08-26 18:21:20
 * @LastEditors: Please set LastEditors
 */

import defaultState from './switchBoxState'

const switchBox = (state = defaultState, action) => {
  switch (action.type) {
    // 切换显示状态
    case 'SWITCHBOX_SHOW_SWITCHBAR':
      return { ...state, show: action.show ? false : true }

    // 上一页
    case 'SWITCHBOX_GO_PREVPAGE':
      return { ...state, curPage: action.page > 1 ? action.page - 1 : action.page }

    // 下一页
    case 'SWITCHBOX_GO_NEXTPAGE':
      return { ...state, curPage: action.page < state.totalPage ? action.page + 1 : action.page }

    // 键盘侠
    case 'SWITCHBOX_GO_HANDLE_KEYDOWN':
      switch (action.keyCode) {
        case 13:
          break;
        case 8:
          // delete 键盘删去
          return { ...state, toPage: action.page.slice(0, -1) }
        default:
          if (action.keyCode >= 49 && action.keyCode <= 57) {
            return { ...state, toPage: action.page + action.key }
          } else {
            return state
          }
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
