import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { ClearFix, Mixins, Styles } from 'material-ui'

const { Colors, Spacing } = Styles
const { StylePropable, StyleResizable } = Mixins
const ThemeManager = new Styles.ThemeManager()

export default class ContentPage extends React.Component {
  getStyles () {
    return {
      root: {
        paddingTop: Spacing.desktopKeylineIncrement + 'px'
      },
      content: {
        boxSizing: 'border-box',
        //padding: Spacing.desktopGutter + 'px',
        maxWidth: (Spacing.desktopKeylineIncrement * 14) + 'px'
      }
    };
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
