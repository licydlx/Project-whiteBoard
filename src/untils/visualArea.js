/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-14 15:54:19
 * @LastEditTime: 2019-08-15 15:17:12
 * @LastEditors: Please set LastEditors
 */

const visualArea = () => {
  // 显示区域宽度
  let windowWidth = 0;
  // 显示区域高度
  let windowHeight = 0;

  if (self.innerHeight) { // all except Explorer    
    if (document.documentElement.clientWidth) {
      windowWidth = document.documentElement.clientWidth;
    } else {
      windowWidth = self.innerWidth;
    }
    windowHeight = self.innerHeight;
  } else {
    if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode    
      windowWidth = document.documentElement.clientWidth;
      windowHeight = document.documentElement.clientHeight;
    } else {
      if (document.body) { // other Explorers    
        windowWidth = document.body.clientWidth;
        windowHeight = document.body.clientHeight;
      }
    }
  }

  return {
    windowWidth,
    windowHeight
  }
}
export default visualArea