/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-09-20 16:34:29
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'react-redux'
import { switchToolbar,toggleToolbar, changePenSize, changePenColor, changeTextSize, changePenShape, changeSize,changePositionToolbar } from '../actions'
import Sketchpad from '../components/sketchpad/index'

const mapStateToProps = state => ({
  sketchpad: state.sketchpad
})

const mapDispatchToProps = dispatch => ({
  switchToolbar: (par) => dispatch(switchToolbar(par)),
  toggleToolbar: () => dispatch(toggleToolbar()),
  changePenSize: (par) => dispatch(changePenSize(par)),
  changePenColor: (par) => dispatch(changePenColor(par)),
  changeTextSize: (par) => dispatch(changeTextSize(par)),
  changePenShape: (par) => dispatch(changePenShape(par)),
  changeSize:(par) => dispatch(changeSize(par)),
  changePositionToolbar:(par) => dispatch(changePositionToolbar(par)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sketchpad)
