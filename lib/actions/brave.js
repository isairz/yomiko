import 'whatwg-fetch'
import parseLinkHeader from 'parse-link-header'
import { FETCH_MANGA_LIST, FETCH_MANGA_INFO, FETCH_CHAPTER_LIST, FETCH_CHAPTER_INFO, FETCH_PAGE_LIST } from './ActionTypes'
import { API_SERVER } from '../../config'

export function fetchMangaList (options) {
  const { q } = options
  return dispatch => {
    // TODO: handle errors
    const query = !q ? '' : ('?q=' + encodeURIComponent(q.replace('+', '%')))
    fetch(`${API_SERVER}/MangaList${query}`)
    .then(res => {
      const pagination = parseLinkHeader(res.headers.get('link'))
      res.json().then(result => dispatch({
        type: FETCH_MANGA_LIST,
        list: result,
        pagination
      }))
    })
  }
}

export function fetchMangaInfo (options) {
  const { ID } = options

  return dispatch => {
    // TODO: handle errors
    fetch(`${API_SERVER}/MangaInfo/${ID}`)
    .then(res => res.json())
    .then(res => dispatch({
      type: FETCH_MANGA_INFO,
      info: res
    }))
  }
}

export function fetchChapterList (options) {
  const { ID } = options

  return dispatch => {
    // TODO: handle errors
    fetch(`${API_SERVER}/ChapterList/${ID}`)
    .then(res => res.json())
    .then(res => dispatch({
      type: FETCH_CHAPTER_LIST,
      list: res
    }))
  }
}

export function fetchChapterInfo (options) {
  const { mangaID, chapter } = options

  return dispatch => {
    // TODO: handle errors
    fetch(`${API_SERVER}/ChapterInfo/${mangaID}/${chapter}`)
    .then(res => res.json())
    .then(res => dispatch({
      type: FETCH_CHAPTER_INFO,
      info: res
    }))
  }
}

export function fetchPageList (options) {
  const { mangaID, chapter } = options

  return dispatch => {
    // TODO: handle errors
    fetch(`${API_SERVER}/PageList/${mangaID}/${chapter}`)
    .then(res => res.json())
    .then(res => dispatch({
      type: FETCH_PAGE_LIST,
      list: res
    }))
  }
}

