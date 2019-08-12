/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-08-12 17:14:41
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'react-redux'
import { toggleSketchpad, changePenSize, changePenColor, changeTextSize, changePenShape } from '../actions'
import Sketchpad from '../components/sketchpad/index'

const mapStateToProps = state => ({
  sketchpad: state.sketchpad
})

const mapDispatchToProps = dispatch => ({
  toggleSketchpad: name => dispatch(toggleSketchpad(name)),
  changePenSize: (name, penSize) => dispatch(changePenSize(name, penSize)),
  changePenColor: (name, penColor) => dispatch(changePenColor(name, penColor)),
  changeTextSize: (name, textSize) => dispatch(changeTextSize(name, textSize)),
  changePenShape: (name, penShape) => dispatch(changePenShape(name, penShape)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sketchpad)
