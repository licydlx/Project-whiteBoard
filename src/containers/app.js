/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 18:30:09
 * @LastEditTime: 2019-08-26 10:43:49
 * @LastEditors: Please set LastEditors
 */
import { connect } from 'react-redux'
import App from '../components/app'

const mapStateToProps = state => ({
  state: state
})


export default connect(
  mapStateToProps
)(App)
