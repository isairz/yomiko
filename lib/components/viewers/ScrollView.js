import React, { PropTypes } from 'react'
import { AppBar, AppCanvas } from 'material-ui'
import ContentPage from '../ContentPage'

export default class Layout extends React.Component {

  static propTypes = {
    children: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    title: PropTypes.string,
  }

  getStyles () {
    return {
      appBar: {
        position: 'absolute',
      },
    }
  }

  render () {
    const styles = this.getStyles()
    const title = this.props.title || 'Yomiko!'

    return (
      <AppCanvas>
        <AppBar
          onLeftIconButtonTouchTab={this.handleMenuClick}
          title={title}
          zDepth={1}
          style={styles.appBar}
          />

        <ContentPage>
          {this.props.children}
        </ContentPage>
      </AppCanvas>
    )
  }
}
