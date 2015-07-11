import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { AppBar, AppCanvas, IconButton, Menu, TextField, Styles } from 'material-ui'
import AppLeftNav from '../AppLeftNav'
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

    this.handleMenuClick = this.handleMenuClick.bind(this)
  }

  getChildContext () {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  getStyles () {
    return {
      searchText: {
        top: '8px',
        width: '100%',
      },
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
    const title = this.props.title || 'Yomiko!'
    const findButton = (
      <IconButton
        iconStyle={styles.iconButton}
        iconClassName='muidocs-icon-custom-find'
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

        <ContentPage>
          {this.props.children &&
            React.cloneElement(this.props.children, this.props )}

        </ContentPage>
      </AppCanvas>
    )
  }

  handleMenuClick () {
    this.refs.leftNav.toggle()
  }
}
