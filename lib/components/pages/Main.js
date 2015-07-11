import React, { PropTypes } from 'react'
import { Styles } from 'material-ui'
import fetchOnUpdate from '../../decorators/fetchOnUpdate'

import Layout from '../layouts/Main.js'
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
      <Layout>
        <MangaList list={list} />
      </Layout>
    )
  }

  handleMenuClick () {
    this.refs.leftNav.toggle()
  }
}
