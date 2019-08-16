/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-08-16 18:11:13
 * @LastEditors: Please set LastEditors
 */

import defaultState from './switchBoxState'

const switchBox = (state = defaultState, action) => {
  switch (action.type) {
    case 'TOGGLE_SWICHBOX':
      return { ...state, show: action.show ? false : true }

    case 'GO_PREVPAGE':
      return { ...state, prevPage: action.prevPage - 1 }
    default:
      return state
  }
}

export default switchBox
