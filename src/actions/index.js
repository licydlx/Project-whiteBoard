/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:00
 * @LastEditTime: 2019-08-16 18:07:30
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
export const changePenSize = (name, penSize) => ({
  type: 'CHANGE_PENSIZE',
  name,
  penSize
})

// 改变笔触颜色
export const changePenColor = (name, penColor) => ({
  type: 'CHANGE_PENCOLOR',
  name,
  penColor
})

// 改变文字大小
export const changeTextSize = (name, textSize) => ({
  type: 'CHANGE_TEXTSIZE',
  name,
  textSize
})

// 改变笔触形状
export const changePenShape = (name, penShape) => ({
  type: 'CHANGE_PENSHAPE',
  name,
  penShape
})

// 窗口大小改变，画布改变
export const changeBoard = (width, height) => ({
  type: 'CHANGE_BOARD',
  width,
  height
})

// ======
// 切页工具栏
// ======

// 切换切页工具栏
export const toggleSwitchBox = () => ({
  type: 'TOGGLE_SWICHBOX',
})

// 去上一页
export const goPrevPage = (page) => ({
  type: 'GO_PREVPAGE',
  page
})

// 去下一页
export const goNextPage = (page) => ({
  type: 'GO_NEXTPAGE',
  page
})

// 进入指定页
export const handleKeydown = (page) => ({
  type: 'HANDLE_KEYDOWN',
  page
})

// 全屏切换
export const fullscreen = () => ({
  type: 'FULL_SCREEN',
})








