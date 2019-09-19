/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-09-19 16:54:40
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'react-redux'
import { switchType, setTotalPage, loadingSwitch, goDefaultState } from '../actions'
import Courseware from '../components/courseware/index'

const mapStateToProps = state => ({
  courseware: state.courseware,
  switchBox: state.switchBox
})

const mapDispatchToProps = dispatch => ({
  switchType: (par) => dispatch(switchType(par)),
  setTotalPage: (par) => dispatch(setTotalPage(par)),
  loadingSwitch: (par) => dispatch(loadingSwitch(par)),
  goDefaultState: () => dispatch(goDefaultState()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Courseware)
