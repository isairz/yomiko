import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { List, ListItem, Styles } from 'material-ui'
import fetchOnUpdate from '../../decorators/fetchOnUpdate'

import Layout from '../layouts/Secondary.js'

const { Colors } = Styles
const ThemeManager = new Styles.ThemeManager()

@fetchOnUpdate(['mangaID'], (params, actions) => {
  const { mangaID } = params
  actions.fetchMangaInfo({ ID: mangaID })
  actions.fetchChapterList({ ID: mangaID })
})
export default class Search extends React.Component {

  static propTypes = {
    brave: PropTypes.object.isRequired
  }

  render () {
    const { params: { mangaID },  brave: { mangaInfo, chapterList } } = this.props

    return (
      <Layout title={mangaInfo.Name}>
        <List>
          {chapterList.map((chapter, idx) => 
            <ListItem
              key={idx+1}
              containerElement={<Link to={`/manga/${mangaID}/${idx+1}`} />}
              insetChildren={true}
              primaryText={chapter.Name}
            />
          )}
        </List>
      </Layout>
    )
  }
}

