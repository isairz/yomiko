import { FETCH_MANGA_LIST, FETCH_MANGA_INFO, FETCH_CHAPTER_LIST, FETCH_CHAPTER_INFO, FETCH_PAGE_LIST } from '../actions/ActionTypes'

const initialState = {
  mangaList: {
    list: [],
    pagication: {},
  },
  mangaInfo: {},
  chapterList: [],
  chapterInfo: {},
  pageList: [],
}

const actionsMap = {
  [FETCH_MANGA_LIST]: (state, action) => (
    {
      mangaList: Object.assign({}, state.mangaList, {
        list: action.list,
        pagination: action.pagination,
      })
    }),
  [FETCH_MANGA_INFO]: (state, action) => ({ mangaInfo: action.info }),
  [FETCH_CHAPTER_LIST]: (state, action) => ({ chapterList: action.list }),
  [FETCH_CHAPTER_INFO]: (state, action) => ({ chapterInfo: action.info }),
  [FETCH_PAGE_LIST]: (state, action) => ({ pageList: action.list }),
}

export default function brave (state = initialState, action) {
  const reduceFn = actionsMap[action.type]
  if (!reduceFn) return state

  return Object.assign({}, state, reduceFn(state, action))
}
