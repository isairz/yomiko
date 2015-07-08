import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { AppBar, AppCanvas, IconButton, Menu, Styles } from 'material-ui'
import AppLeftNav from './AppLeftNav'

const { Colors, Typography } = Styles
const ThemeManager = new Styles.ThemeManager()

export default class Application extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  static childContextTypes = {
    muiTheme: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)

    this.handleMenuClick = this.handleMenuClick.bind(this)
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
    const title = 'Yomiko!'
    const findButton = (
      <IconButton
        iconStyle={styles.iconButton}
        iconClassName='yomiko-icon-custom-find'
        href='#'
        linkButton={true} />
    )

    return (
      <AppCanvas>
        <AppBar
          onLeftIconButtonTouchTab={this.handleMenuClick}
          title={title}
          zDepth={0}
          iconElementRight={findButton} />

        <AppLeftNav ref="leftNav" />

        {this.props.children}
      </AppCanvas>
    )
  }

  handleMenuClick () {
    this.refs.leftNav.toggle()
  }
}
