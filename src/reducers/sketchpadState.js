/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 13:33:26
 * @LastEditTime: 2019-09-25 11:39:39
 * @LastEditors: Please set LastEditors
 */
import visualArea from '../untils/visualArea'
let { windowWidth, windowHeight } = { ...visualArea() }

export default {
  boardSize: {
    width: windowWidth,
    height: windowHeight
  },
  show: false,
  toggle: false,
  zIndex:3,
  position: {
    top: "80px",
    right: "30px",
  },
  tools: [
    {
      name: "toggle",
      active: false,
      title: "工具栏"
    },
    {
      name: "board",
      active: true,
      title: "画板切换"
    },
    {
      name: "pen",
      active: false,
      penSize: 2,
      penColor: '#fd2c0a',
      title: "笔"
    },
    {
      name: "text",
      active: false,
      textSize: 14,
      penColor: '#fd2c0a',
      title: "文本"
    },
    {
      name: "graph",
      active: false,
      penShape: "line",
      penColor: "#fd2c0a",
      penSize: 2,
      title: "图形"
    },
    {
      name: "eraser",
      active: false,
      title: "橡皮檫"
    },
    {
      name: "empty",
      active: false,
      title: "清空"
    }
  ],
  boardData: {
    account: "",
    curPage: "",
    type: "",
    path: "",
    pathConfig: "",
    textContent: "",
    mouseFrom: "",
    mouseTo: "",
    created: ""
  }
} 