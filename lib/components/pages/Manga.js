import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { List, ListItem } from 'material-ui'
import fetchOnUpdate from '../../decorators/fetchOnUpdate'

import Layout from '../layouts/Secondary.js'

@fetchOnUpdate(['mangaID'], (params, actions) => {
  const { mangaID } = params
  actions.fetchMangaInfo({ ID: mangaID })
  actions.fetchChapterList({ ID: mangaID })
})
export default class Search extends React.Component {

  static propTypes = {
    params: PropTypes.object,
    brave: PropTypes.object.isRequired,
  }

  render () {
    const { params: { mangaID }, brave: { mangaInfo, chapterList } } = this.props

    return (
      <Layout title={mangaInfo.Name}>
        <List>
          {chapterList.reverse().map((chapter, idx) =>
            <ListItem
              key={chapterList.length - idx}
              containerElement={<Link to={`/manga/${mangaID}/${chapterList.length - idx}`} />}
              insetChildren={true}
              primaryText={chapter.Name}
            />
          )}
        </List>
      </Layout>
    )
  }
}

