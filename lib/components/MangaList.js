import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { List, ListItem } from 'material-ui'

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
            containerElement={<Link to={`/manga/${manga.ID}`} />}
            insetChildren={true}
            primaryText={manga.Name}
          />
        )}
      </List>
    )
  }
}

