/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-09-20 17:28:57
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

    // 画板工具栏 改变位置
    case 'BOARD_POSITION_TOOLBAR':
      return {
        ...state, position: { right: action.right, top: action.top }
      }

    // switch 工具
    case 'BOARD_SWITCH_TOOLBAR':
      return {
        ...state, tools: state.tools.map(tool => {
          return { ...tool, active: (tool.name === action.name) ? true : false }
        })
      }

    // toggle 工具栏
    case 'BOARD_TOGGLE_TOOLBAR':
      return {
        ...state, toggle: state.toggle ? false : true
      }

    // 改变 board zindex
    case 'BOARD_CHANGE_ZINDEX':
      return {
        ...state, zIndex: action.zIndex
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
      return {
        ...state, boardData: {
          account: action.account,
          curPage: action.curPage,
          type: action.type,
          path: action.path,
          pathConfig: action.pathConfig
        }
      }
    // 添加文本  
    case "BOARD_ADD_TEXT":
      return {
        ...state, boardData: {
          account: action.account,
          curPage: action.curPage,
          type: action.type,
          textContent: action.textContent,
          mouseFrom: action.mouseFrom
        }
      }
    // 添加图形
    case "BOARD_ADD_GRAPH":
      return {
        ...state, boardData: {
          account: action.account,
          curPage: action.curPage,
          type: action.type,
          mouseFrom: action.mouseFrom,
          mouseTo: action.mouseTo
        }
      }
    // 删去被选中的
    case "BOARD_REMOVE_CREATED":
      return {
        ...state, boardData: {
          account: action.account,
          curPage: action.curPage,
          type: action.type,
          created: action.created
        }
      }

    default:
      return state
  }
}

export default sketchpad
