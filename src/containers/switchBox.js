/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-09-19 13:52:57
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'react-redux'
import {goHandleKeydown, fullscreen, switchToolbar, changePenSize, changePenColor, changeTextSize, changePenShape, addPath, addText, addGraph, removeCreated, reduceToolbar, childMessageBox } from '../actions'


import SwitchBox from '../components/switchBox/index'

const mapStateToProps = state => ({
  switchBox: state.switchBox
})

const mapDispatchToProps = dispatch => ({
  goHandleKeydown: (par) => dispatch(goHandleKeydown(par)),
  fullscreen: () => dispatch(fullscreen()),

  switchToolbar: par => dispatch(switchToolbar(par)),
  changePenSize: (par) => dispatch(changePenSize(par)),
  changePenColor: (par) => dispatch(changePenColor(par)),
  changeTextSize: (par) => dispatch(changeTextSize(par)),
  changePenShape: (par) => dispatch(changePenShape(par)),

  addPath: (par) => dispatch(addPath(par)),
  addText: (par) => dispatch(addText(par)),
  addGraph: (par) => dispatch(addGraph(par)),
  removeCreated: (par) => dispatch(removeCreated(par)),
  reduceToolbar: () => dispatch(reduceToolbar()),

  childMessageBox: (par) => dispatch(childMessageBox(par)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchBox)
