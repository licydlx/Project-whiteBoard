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

// 改变文字大小
export const changeFontSize = fontSize => ({
  type: 'CHANGE_FONTSIZE',
  fontSize
})


