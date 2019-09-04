/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-09-04 12:00:37
 * @LastEditors: Please set LastEditors
 */

import defaultState from './coursewareState'

const courseware = (state = defaultState, action) => {
  switch (action.type) {
    // 切换不同类型的课件
    case 'COURSEWARE_SWITCH_TYPE':
      if(state.link !== action.link){
        return { ...state, name: action.name, link: action.link }
      } else {
        return state;
      }
      
    default:
      return state
  }
}

export default courseware
