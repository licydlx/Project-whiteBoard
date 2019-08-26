/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-08-26 12:08:36
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'react-redux'
import { goPrevPage, goHandleKeydown, goNextPage, fullscreen } from '../actions'
import SwitchBox from '../components/switchBox/index'

const mapStateToProps = state => ({
  switchBox: state.switchBox
})

const mapDispatchToProps = dispatch => ({
  goPrevPage: par => dispatch(goPrevPage(par)),
  goHandleKeydown: (par) => dispatch(goHandleKeydown(par)),
  goNextPage: (par) => dispatch(goNextPage(par)),
  fullscreen: () => dispatch(fullscreen()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchBox)
