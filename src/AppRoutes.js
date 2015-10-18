import React, { PropTypes } from 'react-native'
import { Router, Route } from 'react-router'
import { connect } from 'react-redux/native'
import { bindActionCreators } from 'redux'

class Root extends React.Component {
  render () {
    const { history } = createMemoryHistory();
    return (
      () => renderRoutes(history)
    )
  }
}

function renderRoutes (history) {
  return (
    <Router history={history}>
      <Route component={Application}>
        <Route name="main" path="/" component={Serieses} />
        <Route name="search" path="/search" component={Search} />
        <Route name="series" path="manga/:mangaID" component={Manga} />
        <Route name="chapter" path="/manga/:mangaID/:chapter" component={Chapter} />
      </Route>
    </Router>
  )
}

function mapStateToProps(state) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Counter);
