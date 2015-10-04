import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { Avatar, List, ListItem } from 'material-ui'

export default class MangaList extends React.Component {

  static propTypes = {
    list: PropTypes.array.isRequired,
  }

  render () {
    const { list } = this.props

    return (
      <List>
        {list.map(manga =>
          <ListItem
            leftAvatar={<Avatar src={`${manga.Thumbnail}`} />}
            containerElement={<Link to={`/manga/${manga.ID}`} />}
            primaryText={manga.Name}
            secondaryText={<p></p>}
            secondaryTextLines={2}
          />
        )}
      </List>
    )
  }
}

