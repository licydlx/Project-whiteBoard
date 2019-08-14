/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 13:33:26
 * @LastEditTime: 2019-08-14 18:30:59
 * @LastEditors: Please set LastEditors
 */
import visualArea from '../untils/visualArea'
let { windowWidth, windowHeight } = { ...visualArea() }

export default {
  boardSize: {
    width: windowWidth,
    height: windowHeight
  },
  tools: [
    {
      name: "board",
      active: true,
    },
    {
      name: "pen",
      active: false,
      penSize: 2,
      penColor: '#fff'
    },
    {
      name: "text",
      active: false,
      textSize: 14,
      penColor: '#fff'
    },
    {
      name: "graph",
      active: false,
      penShape: "line",
      penColor: "#fff",
      penSize: 2
    },
    {
      name: "eraser",
      active: false,
    },
    {
      name: "empty",
      active: false,
    }
  ]
} 