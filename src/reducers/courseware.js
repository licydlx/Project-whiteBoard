/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-09-19 14:57:18
 * @LastEditors: Please set LastEditors
 */

import defaultState from './coursewareState'

const courseware = (state = defaultState, action) => {
  switch (action.type) {
    // 切换不同类型的课件
    case 'COURSEWARE_SWITCH_TYPE':
      switch (action.name) {
        case "html5":
          return { ...state, name: action.name, link: action.link ,ratio: action.ratio}

        case "pdf":
          return { ...state, name: action.name, link: action.link, ratio: action.ratio }
          
        case "default":
            return { ...state, name: action.name }
      }
  }
  return state;
}

export default courseware
