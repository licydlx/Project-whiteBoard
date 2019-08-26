/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-08-26 16:25:47
 * @LastEditors: Please set LastEditors
 */

import defaultState from './sketchpadState'

const sketchpad = (state = defaultState, action) => {
  switch (action.type) {
    // 显示 画板工具栏
    case 'BOARD_SHOW_TOOLBAR':
      return {
        ...state, show: true
      }

    // 隐藏 画板工具栏
    case 'BOARD_HIDE_TOOLBAR':
      return {
        ...state, show: false
      }

    case 'BOARD_SWITCH_TOOLBAR':
      return {
        ...state, tools: state.tools.map(tool => {
          return { ...tool, active: (tool.name === action.name) ? true : false }
        })
      }


    case 'BOARD_CHANGE_PENSIZE':
      return {
        ...state, tools: state.tools.map(tool =>
          (tool.name === action.name)
            ? { ...tool, penSize: action.penSize }
            : { ...tool }
        )
      }

    case 'BOARD_CHANGE_PENCOLOR':
      return {
        ...state, tools: state.tools.map(tool =>
          (tool.name === action.name)
            ? { ...tool, penColor: action.penColor }
            : { ...tool }
        )
      }

    case 'BOARD_CHANGE_TEXTSIZE':
      return {
        ...state, tools: state.tools.map(tool =>
          (tool.name === action.name)
            ? { ...tool, textSize: action.textSize }
            : { ...tool }
        )
      }

    case 'BOARD_CHANGE_PENSHAPE':
      return {
        ...state, tools: state.tools.map(tool =>
          (tool.name === action.name && action.penShape)
            ? { ...tool, penShape: action.penShape }
            : { ...tool }
        )
      }

    case 'BOARD_CHANGE_SIZE':
      return {
        ...state, boardSize: {
          width: action.width,
          height: action.height
        }
      }

    // 还原 画板toolbar
    case "BOARD_REDUCE_TOOLBAR":
      return {
        ...state, ...defaultState, show: state.show
      }

    // 添加自由笔画
    case "BOARD_ADD_PATH":
    // 添加文本  
    case "BOARD_ADD_TEXT":
    // 添加图形
    case "BOARD_ADD_GRAPH":
    // 删去被选中的
    case "BOARD_REMOVE_CREATED":
    default:
      return state
  }
}

export default sketchpad
