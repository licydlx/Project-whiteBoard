/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-08-26 18:06:39
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'react-redux'
import { switchToolbar, changePenSize, changePenColor, changeTextSize, changePenShape, changeSize } from '../actions'
import Sketchpad from '../components/sketchpad/index'

const mapStateToProps = state => ({
  sketchpad: state.sketchpad
})

const mapDispatchToProps = dispatch => ({
  switchToolbar: (par) => dispatch(switchToolbar(par)),
  changePenSize: (par) => dispatch(changePenSize(par)),
  changePenColor: (par) => dispatch(changePenColor(par)),
  changeTextSize: (par) => dispatch(changeTextSize(par)),
  changePenShape: (par) => dispatch(changePenShape(par)),
  changeSize:(par) => dispatch(changeSize(par)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sketchpad)
