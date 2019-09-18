/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-09-18 11:16:31
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'react-redux'
import { loadingSwitch } from '../actions'
import Loading from '../components/loading/index'

const mapStateToProps = state => ({
  loading: state.loading
})

const mapDispatchToProps = dispatch => ({
  loadingSwitch: (par) => dispatch(loadingSwitch(par)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading)
