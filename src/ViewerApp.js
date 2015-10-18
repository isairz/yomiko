import React, { Component } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux/native'

//import Viewer from '../components/viewer'
//import * as viewerActions from '../actions/viewerActions'

class ViewerApp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { state, dispatch } = this.props;

    return (
      <Viewer
        data={state.data}
        {...bindActionCreators(ViewerActions, dispatch)} />
    );
  }
}

function select(state) {
  return {
    visibleTodos: selectTodos(state.todos, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter
  };
}

module.exports = connect(select)(ViewerApp)
