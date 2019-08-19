/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-08-19 16:17:40
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'react-redux'
import { switchCourseware } from '../actions'
import Courseware from '../components/courseware/index'

const mapStateToProps = state => ({
  courseware: state.courseware
})

const mapDispatchToProps = dispatch => ({
  switchCourseware: (name, link) => dispatch(switchCourseware(name, link))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Courseware)
