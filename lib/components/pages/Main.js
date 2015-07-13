import React, { PropTypes } from 'react'
import fetchOnUpdate from '../../decorators/fetchOnUpdate'

import Layout from '../layouts/Main.js'
import MangaList from '../MangaList'

@fetchOnUpdate(['mangaList'], (params, actions) => {
  const { query } = params
  actions.fetchMangaList({ query })
})
export default class Search extends React.Component {

  static propTypes = {
    brave: PropTypes.object,
  }

  render () {
    const { brave: { mangaList } } = this.props
    const { list } = mangaList

    return (
      <Layout>
        <MangaList list={list} />
      </Layout>
    )
  }
}
