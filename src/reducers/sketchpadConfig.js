/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-09 14:00:42
 * @LastEditTime: 2019-08-12 12:08:07
 * @LastEditors: Please set LastEditors
 */
const defaultState = {
  penSize: "2",
  penColor: "#fff",
  textSize: "14",
  penShape: ""
};

const sketchpadConfig = (state = defaultState, action) => {
  switch (action.type) {
    case 'CONFIG_SKETCHPAD':
      return Object.assign({},state,action.type);
    default:
      return state
  }
}

export default sketchpadConfig
