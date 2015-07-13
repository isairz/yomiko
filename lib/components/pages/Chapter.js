import React, { PropTypes } from 'react'
import fetchOnUpdate from '../../decorators/fetchOnUpdate'

import Viewer from '../viewers/PageView'

@fetchOnUpdate([ 'mangaID', 'chapter' ], (params, actions) => {
  const { mangaID, chapter } = params
  actions.fetchChapterInfo({ mangaID, chapter })
  actions.fetchPageList({ mangaID, chapter })
})
export default class Chapter extends React.Component {

  static propTypes = {
    brave: PropTypes.object,
    params: PropTypes.object,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const { brave: { chapterInfo, pageList } } = this.props

    return (
      <Viewer
        title={chapterInfo.Name}
        list={pageList}
        goPrevChapter={this.goPrevChapter.bind(this)}
        goNextChapter={this.goNextChapter.bind(this)}
      />
    )
  }

  goPrevChapter () {
    const { mangaID, chapter } = this.props.params
    this.context.router.replaceWith(`/manga/${mangaID}/${parseInt(chapter) - 1}`)
  }

  goNextChapter () {
    const { mangaID, chapter } = this.props.params
    this.context.router.replaceWith(`/manga/${mangaID}/${parseInt(chapter) + 1}`)
  }
}
