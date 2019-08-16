/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:21
 * @LastEditTime: 2019-08-16 18:11:48
 * @LastEditors: Please set LastEditors
 */
import { combineReducers } from 'redux'
import sketchpad from './sketchpad'
import switchBox from './switchBox'

export default combineReducers({
  sketchpad,
  switchBox
})
