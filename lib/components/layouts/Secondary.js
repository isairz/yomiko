import React, { PropTypes } from 'react'
import { AppBar, AppCanvas, IconButton, SvgIcon } from 'material-ui'
import ContentPage from '../ContentPage'

export default class Layout extends React.Component {

  static propTypes = {
    children: PropTypes.any,
    title: PropTypes.string,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  getStyles () {
    return {
    }
  }

  render () {
    const { title } = this.props
    const { router } = this.context
    const goBackIcon = (
      <IconButton onClick={() => router.goBack()}><SvgIcon>
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </SvgIcon></IconButton>
    )

    return (
      <AppCanvas>
        <AppBar
          iconElementLeft={goBackIcon}
          title={title}
        />

        <ContentPage>
          {this.props.children &&
            React.cloneElement(this.props.children, this.props )}

        </ContentPage>
      </AppCanvas>
    )
  }
}

