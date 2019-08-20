/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-08-20 14:06:54
 * @LastEditors: Please set LastEditors
 */

import defaultState from './sketchpadState'

const sketchpad = (state = defaultState, action) => {
  if (window.whiteBoardSignal) window.whiteBoardSignal.channel.messageChannelSend(JSON.stringify({
    state,
    action
  }));
  switch (action.type) {
    case 'TOGGLE_SKETCHPAD':
      return {
        ...state, tools: state.tools.map(tool =>
          (tool.name === action.name)
            ? { ...tool, active: true }
            : { ...tool, active: false }
        )
      }

    case 'CHANGE_PENSIZE':
      return {
        ...state, tools: state.tools.map(tool =>
          (tool.name === action.name)
            ? { ...tool, penSize: action.penSize }
            : { ...tool }
        )
      }

    case 'CHANGE_PENCOLOR':
      return {
        ...state, tools: state.tools.map(tool =>
          (tool.name === action.name)
            ? { ...tool, penColor: action.penColor }
            : { ...tool }
        )
      }

    case 'CHANGE_TEXTSIZE':
      return {
        ...state, tools: state.tools.map(tool =>
          (tool.name === action.name)
            ? { ...tool, textSize: action.textSize }
            : { ...tool }
        )
      }

    case 'CHANGE_PENSHAPE':
      return {
        ...state, tools: state.tools.map(tool =>
          (tool.name === action.name && action.penShape)
            ? { ...tool, penShape: action.penShape }
            : { ...tool }
        )
      }

    case 'CHANGE_BOARD':
      return {
        ...state, boardSize: {
          width: action.width,
          height: action.height
        }
      }

    default:
      return state
  }
}

export default sketchpad
