/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:00
 * @LastEditTime: 2019-08-21 17:27:20
 * @LastEditors: Please set LastEditors
 */
let id = 0

// ======
// 画板区
// ======
// 切换工具显示与隐藏
export const toggleSketchpad = name => ({
  type: 'TOGGLE_SKETCHPAD',
  id: id++,
  name
})

// 改变笔触大小
export const changePenSize = (name, penSize) => ({
  type: 'CHANGE_PENSIZE',
  id: id++,
  name,
  penSize
})

// 改变笔触颜色
export const changePenColor = (name, penColor) => ({
  type: 'CHANGE_PENCOLOR',
  id: id++,
  name,
  penColor
})

// 改变文字大小
export const changeTextSize = (name, textSize) => ({
  type: 'CHANGE_TEXTSIZE',
  id: id++,
  name,
  textSize
})

// 改变笔触形状
export const changePenShape = (name, penShape) => ({
  type: 'CHANGE_PENSHAPE',
  id: id++,
  name,
  penShape
})

// 窗口大小改变，画布改变
export const changeBoard = (width, height) => ({
  type: 'CHANGE_BOARD',
  id: id++,
  width,
  height
})

// ======
// canvas板区
// ======

// canvas板 添加 path
export const addPath = (path, pathConfig) => ({
  type: 'BOARD_ADD_PATH',
  id: id++,
  path,
  pathConfig
})

// canvas板 添加 text
export const addText = (mouseFrom, textContent) => ({
  type: 'BOARD_ADD_TEXT',
  id: id++,
  mouseFrom,
  textContent
})

// canvas板 添加 graph
export const addGraph = (mouseFrom, mouseTo) => ({
  type: 'BOARD_ADD_GRAPH',
  id: id++,
  mouseFrom,
  mouseTo
})

// canvas板 删除 created
export const removeCreated = (created) => ({
  type: 'BOARD_REMOVE_CREATED',
  id: id++,
  created
})


// ======
// 切页工具栏
// ======

// 切换切页工具栏
export const toggleSwitchBox = () => ({
  type: 'TOGGLE_SWICHBOX',
  id: id++,
})

// 去上一页
export const goPrevPage = (page) => ({
  type: 'GO_PREVPAGE',
  id: id++,
  page
})

// 去下一页
export const goNextPage = (page) => ({
  type: 'GO_NEXTPAGE',
  id: id++,
  page
})

// 进入指定页
export const goHandleKeydown = (e) => ({
  type: 'GO_HANDLE_KEYDOWN',
  id: id++,
  e
})

// // 动态改变页码值
// export const goHandleChange = (e) => ({
//   type: 'GO_HANDLE_CHANGE',
//   e
// })

// 全屏切换
export const fullscreen = () => ({
  type: 'FULL_SCREEN',
  id: id++,
})

// ======
// 课件区
// ======

// 切换不同类型的课件 
export const switchCourseware = (name, link) => ({
  type: 'SWITCH_COURSEWARE',
  id: id++,
  name,
  link
})