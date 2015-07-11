import React, { PropTypes } from 'react'
import { AppBar, AppCanvas, IconButton, Styles } from 'material-ui'
import ContentPage from '../ContentPage'

const { Colors, Typography } = Styles
const ThemeManager = new Styles.ThemeManager()

export default class Layout extends React.Component {

  static propTypes = {
    children: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    title: PropTypes.string,
  }

  static childContextTypes = {
    muiTheme: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)

    //this.handleMenuClick = this.handleMenuClick.bind(this)
  }

  getChildContext () {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  getStyles () {
    return {
      footer: {
        backgroundColor: Colors.grey900,
        textAlign: 'center'
      },
      a: {
        color: Colors.darkWhite
      },
      p: {
        margin: '0 auto',
        padding: '0',
        color: Colors.lightWhite,
        maxWidth: '335px'
      },
      iconButton: {
        color: Colors.darkWhite
      }
    }
  }

  render () {
    const styles = this.getStyles()
    const title = this.props.title || ''

    return (

      <AppCanvas>
        <AppBar
          onLeftIconButtonTouchTab={this.handleMenuClick}
          title={title}
          zDepth={0} />

        <ContentPage>
          {this.props.children &&
            React.cloneElement(this.props.children, this.props )}

        </ContentPage>
      </AppCanvas>
    )
  }

  handleMenuClick () {
    console.log("Back")
    this.goBack()
  }
}
