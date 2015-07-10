import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { Styles } from 'material-ui'
import fetchOnUpdate from '../../decorators/fetchOnUpdate'

import ContentPage from '../ContentPage'
import MangaList from '../MangaList'

const { Colors, Typography } = Styles
const ThemeManager = new Styles.ThemeManager()

@fetchOnUpdate(['mangaList'], (params, actions) => {
  const { query } = params
  actions.fetchMangaList({ query })
})
export default class Search extends React.Component {

  static propTypes = {
    brave: PropTypes.object
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
    const { brave: { mangaList } } = this.props
    const { list, pagination } = mangaList


    return (
      <ContentPage>
        <MangaList list={list} />
      </ContentPage>
    )
  }

  handleMenuClick () {
    this.refs.leftNav.toggle()
  }
}
