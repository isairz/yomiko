import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import { List, ListItem, Styles } from 'material-ui'
import fetchOnUpdate from '../../decorators/fetchOnUpdate'

import ContentPage from '../ContentPage'

const { Colors, Typography } = Styles
const ThemeManager = new Styles.ThemeManager()

@fetchOnUpdate(['mangaID'], (params, actions) => {
  const { mangaID } = params
  actions.fetchMangaInfo({ ID: mangaID })
  actions.fetchChapterList({ ID: mangaID })
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
    const { brave: { mangaInfo, chapterList } } = this.props
    // FIXME: replace mangaInfo.ID

    return (
      <ContentPage>
        <List>
          {chapterList.map((chapter, idx) => 
            <ListItem
              containerElement={<Link to={`/manga/${mangaInfo.ID}/${idx+1}`} />}
              insetChildren={true}
              primaryText={chapter.Name}
            />
          )}
        </List>
      </ContentPage>
    )
  }

  handleMenuClick () {
    this.refs.leftNav.toggle()
  }
}
