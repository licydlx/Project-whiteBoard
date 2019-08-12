/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:00
 * @LastEditTime: 2019-08-12 17:31:04
 * @LastEditors: Please set LastEditors
 */
let nextTodoId = 0
export const addTodo = text => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
})


// ======
// 画板区
// ======
// 切换工具显示与隐藏
export const toggleSketchpad = name => ({
  type: 'TOGGLE_SKETCHPAD',
  name
})

// 改变笔触大小
export const changePenSize = (name,penSize) => ({
  type: 'CHANGE_PENSIZE',
  name,
  penSize
})

// 改变笔触颜色
export const changePenColor = (name,penColor) => ({
  type: 'CHANGE_PENCOLOR',
  name,
  penColor
})

// 改变文字大小
export const changeTextSize = (name,textSize) => ({
  type: 'CHANGE_TEXTSIZE',
  name,
  textSize
})

// 改变笔触形状
export const changePenShape = (name,penShape) => ({
  type: 'CHANGE_PENSHAPE',
  name,
  penShape
})


