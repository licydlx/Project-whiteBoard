/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-08-19 15:43:07
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
  goHandleKeydown: e => dispatch(goHandleKeydown(e)),
  goNextPage: page => dispatch(goNextPage(page)),
  fullscreen: () => dispatch(fullscreen()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchBox)
