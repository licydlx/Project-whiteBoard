/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-08-23 12:23:18
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'react-redux'
import { switchType } from '../actions'
import Courseware from '../components/courseware/index'

const mapStateToProps = state => ({
  courseware: state.courseware
})

const mapDispatchToProps = dispatch => ({
  switchType: (name, link) => dispatch(switchType(name, link))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Courseware)
