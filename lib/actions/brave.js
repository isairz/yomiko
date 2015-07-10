import 'whatwg-fetch'
import parseLinkHeader from 'parse-link-header'
import { BRAVE_API, FETCH_MANGA_LIST, FETCH_MANGA_INFO, FETCH_CHAPTER_LIST, FETCH_CHAPTER_INFO, FETCH_PAGE_LIST } from './ActionTypes'

export function fetchMangaList (options) {
  const { query } = options
  return dispatch => {
    // TODO: handle errors
    fetch(`${BRAVE_API}/MangaList`)
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
    fetch(`${BRAVE_API}/MangaInfo/${ID}`)
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
    fetch(`${BRAVE_API}/ChapterList/${ID}`)
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
    fetch(`${BRAVE_API}/ChapterInfo/${mangaID}/${chapter}`)
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
    fetch(`${BRAVE_API}/PageList/${mangaID}/${chapter}`)
    .then(res => res.json())
    .then(res => dispatch({
      type: FETCH_PAGE_LIST,
      list: res
    }))
  }
}

