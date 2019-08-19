/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-08-19 16:29:28
 * @LastEditors: Please set LastEditors
 */

import defaultState from './coursewareState'

const courseware = (state = defaultState, action) => {
  switch (action.type) {
    // 切换不同类型的课件
    case 'SWITCH_COURSEWARE':
      return { ...state, name: action.name, link: action.link }

    default:
      return state
  }
}

export default courseware
