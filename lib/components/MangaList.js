import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import { List, ListItem, Styles } from 'material-ui'

const { Colors, Spacing, Typography } = Styles
const ThemeManager = new Styles.ThemeManager()

export default class MangaList extends React.Component {

  static propTypes = {
    list: PropTypes.array.isRequired
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
    );
  }
}

