import React, { PropTypes } from 'react'
import { Styles } from 'material-ui'

const { Spacing } = Styles

export default class ContentPage extends React.Component {

  static propTypes = {
    children: PropTypes.any,
  }


  getStyles () {
    return {
      root: {
        paddingTop: Spacing.desktopKeylineIncrement + 'px',
      },
      content: {
        boxSizing: 'border-box',
        //padding: Spacing.desktopGutter + 'px',
        maxWidth: (Spacing.desktopKeylineIncrement * 14) + 'px',
      },
    }
  }

  render () {
    const styles = this.getStyles()
    return (
      <div style={styles.root}>
        <div style={styles.content}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
