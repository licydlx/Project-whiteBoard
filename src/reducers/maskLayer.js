/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-09-10 09:42:19
 * @LastEditors: Please set LastEditors
 */

import defaultState from './maskLayerState'

const maskLayer = (state = defaultState, action) => {
  switch (action.type) {
    // 有操作权限
    case 'BOARD_SHOW_TOOLBAR':
      return { ...state, zIndex: 0 }

    // 无操作权限
    case 'BOARD_HIDE_TOOLBAR':
      return { ...state, zIndex: 9999 }

    default:
      return state
  }
}

export default maskLayer
