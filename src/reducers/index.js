import { combineReducers } from 'redux'
import sketchpadActive from './sketchpadActive'
import sketchpadConfig from './sketchpadConfig'

export default combineReducers({
  sketchpadActive,
  sketchpadConfig
})
