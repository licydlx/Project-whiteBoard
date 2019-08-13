/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 13:33:26
 * @LastEditTime: 2019-08-13 18:12:47
 * @LastEditors: Please set LastEditors
 */

export default {
  boardSize:{
    width:1920,
    height:1080
  },
  tools:[
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
      penShape:"line",
      penColor: '#fff'
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