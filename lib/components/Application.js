import React, { PropTypes } from 'react'
import { Styles } from 'material-ui'

const { Colors } = Styles
const ThemeManager = new Styles.ThemeManager()

import { connect } from 'redux/react'
import { bindActionCreators } from 'redux'
import * as braveActions from '../actions/brave'

@connect(state => ({
  brave: state.brave
}))
export default class Application extends React.Component {

  static propTypes = {
    children: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    muiTheme: PropTypes.object
  }

  getChildContext () {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  render () {
    const { dispatch } = this.props
    const actions = bindActionCreators(braveActions, dispatch)

    // FIXME: cloneElement doesn't preserve context in 13.3
    // https://github.com/facebook/react/issues/4008
    return (
      <div>
        {this.props.children &&
          React.addons.cloneWithProps(this.props.children, { actions, ...this.props })}
      </div>
    )
  }
}
