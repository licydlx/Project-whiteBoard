/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-09-05 17:54:46
 * @LastEditors: Please set LastEditors
 */
import { combineReducers } from 'redux'
import sketchpad from './sketchpad'
import switchBox from './switchBox'
import courseware from './courseware'
import maskLayer from './maskLayer'

export default combineReducers({
  sketchpad,
  switchBox,
  courseware,
  maskLayer
})
