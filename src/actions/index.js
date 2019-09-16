/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:00
 * @LastEditTime: 2019-09-16 11:24:12
 * @LastEditors: Please set LastEditors
 */
let id = 0

// 显示 画板工具栏
export const showToolbar = () => ({
  type: 'BOARD_SHOW_TOOLBAR',
  id: id++,
})

export const hideToolbar = () => ({
  type: 'BOARD_HIDE_TOOLBAR',
  id: id++,
})

// 显示 切换栏
export const showSwitchBar = () => ({
  type: 'SWITCHBOX_SHOW_SWITCHBAR',
  id: id++,
})

// =============
// 画板区
// =============
// 切换不同工具
export const switchToolbar = ({ name }) => ({
  type: 'BOARD_SWITCH_TOOLBAR',
  id: id++,
  name
})

// 改变笔触大小
export const changePenSize = ({ name, penSize }) => ({
  type: 'BOARD_CHANGE_PENSIZE',
  id: id++,
  name,
  penSize
})

// 改变笔触颜色
export const changePenColor = ({ name, penColor }) => ({
  type: 'BOARD_CHANGE_PENCOLOR',
  id: id++,
  name,
  penColor
})

// 改变文字大小
export const changeTextSize = ({ name, textSize }) => ({
  type: 'BOARD_CHANGE_TEXTSIZE',
  id: id++,
  name,
  textSize
})

// 改变笔触形状
export const changePenShape = ({ name, penShape }) => ({
  type: 'BOARD_CHANGE_PENSHAPE',
  id: id++,
  name,
  penShape
})

// 窗口大小改变，画布改变
export const changeSize = ({ width, height }) => ({
  type: 'BOARD_CHANGE_SIZE',
  id: id++,
  width,
  height
})

// 画板 toolbar 还原
export const reduceToolbar = () => ({
  type: 'BOARD_REDUCE_TOOLBAR',
  id: id++
})

// canvas板 添加 path
export const addPath = ({ path, pathConfig }) => ({
  type: 'BOARD_ADD_PATH',
  id: id++,
  path,
  pathConfig
})

// canvas板 添加 text
export const addText = ({ mouseFrom, textContent }) => ({
  type: 'BOARD_ADD_TEXT',
  id: id++,
  mouseFrom,
  textContent
})

// canvas板 添加 graph
export const addGraph = ({ mouseFrom, mouseTo }) => ({
  type: 'BOARD_ADD_GRAPH',
  id: id++,
  mouseFrom,
  mouseTo
})

// canvas板 删除 created
export const removeCreated = ({ created }) => ({
  type: 'BOARD_REMOVE_CREATED',
  id: id++,
  created
})


// =============
// 切页区
// =============

// 初始值
export const goDefaultState = () => ({
  type: 'SWITCHBOX_GO_DEFAULT_VALUE',
  id: id++,
  show: false,
  prevPage: 1,
  curPage: 1,
  toPage: "1",
  totalPage: 1,
  fullScreen: false
})


// 去上一页
export const goPrevPage = ({ page }) => ({
  type: 'SWITCHBOX_GO_PREVPAGE',
  id: id++,
  page
})

// 去下一页
export const goNextPage = ({ page, totalPage }) => ({
  type: 'SWITCHBOX_GO_NEXTPAGE',
  id: id++,
  page,
  totalPage
})

// 进入指定页
export const goHandleKeydown = ({ toPage,curPage,prevPage, totalPage, code }) => ({
  type: 'SWITCHBOX_GO_HANDLE_KEYDOWN',
  id: id++,
  toPage,
  curPage,
  prevPage,
  totalPage,
  code
})

// 设置 总页数
export const setTotalPage = ({totalPage}) => ({
  type: 'SWITCHBOX_SET_TOTAL_PAGE',
  id: id++,
  totalPage
})

// 全屏切换
export const fullscreen = () => ({
  type: 'SWITCHBOX_FULL_SCREEN',
  id: id++,
})

// =============
// 课件区
// =============

// 切换不同类型的课件 
export const switchType = ({ name, link }) => ({
  type: 'COURSEWARE_SWITCH_TYPE',
  id: id++,
  name,
  link
})

// 课件 message 包装
export const childMessageBox = ({ data }) => ({
  type: 'CHILD_MESSAGE_BOX',
  id: id++,
  data
})

// 配置通信
// export const configAll = () => ({
//   type: 'CONFIG_ALL',
//   id: id++,
// })
