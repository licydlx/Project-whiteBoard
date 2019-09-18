/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-09-18 11:24:20
 * @LastEditors: Please set LastEditors
 */
import defaultState from './loadingState'

const loading = (state = defaultState, action) => {
  switch (action.type) {
    case "LOADING_SWITCH":
      return { ...state, show: action.show }
    default:
      return state
  }
}

export default loading;
