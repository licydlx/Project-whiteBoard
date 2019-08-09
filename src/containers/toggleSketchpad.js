import { connect } from 'react-redux'
import { toggleSketchpad } from '../actions'
import Sketchpad from '../components/sketchpad/index'

const mapStateToProps = state => ({
  sketchpadActive: state.sketchpadActive
})

const mapDispatchToProps = dispatch => ({
  toggleSketchpad: name => dispatch(toggleSketchpad(name))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sketchpad)
