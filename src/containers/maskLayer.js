/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-09-05 17:52:50
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'react-redux'
import { showToolbar, hideToolbar } from '../actions'
import MaskLayer from '../components/maskLayer/index'

const mapStateToProps = state => ({
  maskLayer: state.maskLayer
})

const mapDispatchToProps = dispatch => ({
  showToolbar: () => dispatch(showToolbar()),
  hideToolbar: () => dispatch(hideToolbar()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaskLayer)
