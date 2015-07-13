import React, { PropTypes } from 'react'
import { AppBar, AppCanvas, IconButton } from 'material-ui'
import AppLeftNav from '../AppLeftNav'
import ContentPage from '../ContentPage'

export default class Layout extends React.Component {

  static propTypes = {
    children: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    title: PropTypes.node,
  }

  constructor (props, context) {
    super(props, context)

    this.handleMenuClick = this.handleMenuClick.bind(this)
  }

  getStyles () {
    return {
    }
  }

  render () {
    const styles = this.getStyles()
    const title = this.props.title || 'Yomiko!'
    const findButton = (
      <IconButton
        iconStyle={styles.iconButton}
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
