import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import { List, ListItem, Styles } from 'material-ui'
import fetchOnUpdate from '../../decorators/fetchOnUpdate'

import Viewer from '../viewers/PageView'

const { Colors, Typography } = Styles
const ThemeManager = new Styles.ThemeManager()

@fetchOnUpdate(['mangaID', 'chapter'], (params, actions) => {
  const { mangaID, chapter } = params
  actions.fetchChapterInfo({ mangaID, chapter })
  actions.fetchPageList({ mangaID, chapter })
})
export default class Chapter extends React.Component {

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
    const { brave: { chapterInfo, pageList } } = this.props

    return (
      <Viewer title={chapterInfo.Name} list={pageList} />
    )
  }
}
