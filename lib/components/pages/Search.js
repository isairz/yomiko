import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { Styles } from 'material-ui'

import ContentPage from '../ContentPage'
import MangaList from '../MangaList'

const { Colors, Typography } = Styles
const ThemeManager = new Styles.ThemeManager()

export default class Search extends React.Component {

  static propTypes = {
  }

  static childContextTypes = {
    muiTheme: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
  }

  getChildContext () {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  render () {
    const dummy = [
      {Name: "Manga1", ID: 1},
      {Name: "Manga2", ID: 2},
      {Name: "Mansadfga1", ID: 4},
    ]
      

    return (
      <ContentPage>
        <MangaList list={dummy} />
      </ContentPage>
    )
  }

  handleMenuClick () {
    this.refs.leftNav.toggle()
  }
}
