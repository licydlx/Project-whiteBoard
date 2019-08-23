/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-08-23 11:56:10
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'react-redux'
import { switchToolbar, changePenSize, changePenColor, changeTextSize, changePenShape, changeSize } from '../actions'
import Sketchpad from '../components/sketchpad/index'

const mapStateToProps = state => ({
  sketchpad: state.sketchpad
})

const mapDispatchToProps = dispatch => ({
  switchToolbar: name => dispatch(switchToolbar(name)),
  changePenSize: (name, penSize) => dispatch(changePenSize(name, penSize)),
  changePenColor: (name, penColor) => dispatch(changePenColor(name, penColor)),
  changeTextSize: (name, textSize) => dispatch(changeTextSize(name, textSize)),
  changePenShape: (name, penShape) => dispatch(changePenShape(name, penShape)),
  changeSize:(width, height) => dispatch(changeSize(width, height)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sketchpad)
