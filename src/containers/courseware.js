/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-08-26 18:00:38
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'react-redux'
import { switchType } from '../actions'
import Courseware from '../components/courseware/index'

const mapStateToProps = state => ({
  courseware: state.courseware
})

const mapDispatchToProps = dispatch => ({
  switchType: (par) => dispatch(switchType(par))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Courseware)
