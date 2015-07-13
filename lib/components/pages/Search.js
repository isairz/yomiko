import React, { PropTypes } from 'react'
import { TextField } from 'material-ui'
import fetchOnUpdate from '../../decorators/fetchOnUpdate'

import Layout from '../layouts/Secondary.js'
import MangaList from '../MangaList'

@fetchOnUpdate(['q'], (params, actions) => {
  const { q } = params
  actions.fetchMangaList({ q })
})
export default class Search extends React.Component {

  static propTypes = {
    brave: PropTypes.object,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  getStyles () {
    return {
      searchText: {
        top: '8px',
        width: '100%',
      },
    }
  }

  render () {
    const styles = this.getStyles()
    const { brave: { mangaList } } = this.props
    const { list } = mangaList
    const SearchField = <TextField ref="search" style={styles.searchText} hintText="Search Title" onEnterKeyDown={this.handleSearch.bind(this)} />

    return (
      <Layout title={SearchField}>
        <MangaList list={list} />
      </Layout>
    )
  }

  handleSearch () {
    let q = this.refs.search.state.hasValue
    this.context.router.replaceWith('/search/?q=' + (!q ? '' : q.replace(' ', '+')))
  }
}
