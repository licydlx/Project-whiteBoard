/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-08-23 12:09:40
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'react-redux'
import { goPrevPage, goHandleKeydown, goNextPage, fullscreen } from '../actions'
import SwitchBox from '../components/switchBox/index'

const mapStateToProps = state => ({
  switchBox: state.switchBox
})

const mapDispatchToProps = dispatch => ({
  goPrevPage: page => dispatch(goPrevPage(page)),
  goHandleKeydown: (page, totalPage, keyCode, key) => dispatch(goHandleKeydown(page, totalPage, keyCode, key)),
  goNextPage: (page, totalPage) => dispatch(goNextPage(page, totalPage)),
  fullscreen: (fullScreen) => dispatch(fullscreen(fullScreen)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchBox)
