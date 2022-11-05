import callApi, { makeParams } from './callApi'
import SourceMap from '../api/SourceMap'
import vuex from 'vuex'

type State = {
  sourceName: string,
  source: Yomiko.Source,
  manga: {
    list: Yomiko.MangaInfo[]
    total: number
    info: Yomiko.MangaInfo,
    currentId: Yomiko.MangaId
  },
  config: {
    itemsPerPage: number
  }
}

type ActionContext = vuex.ActionContext<State, State>

export const state = () => ({
  sourceName: 'hitomi',
  source: SourceMap.get('hitomi'),
  manga: {
    list: [],
    total: 0,
    info: {},
    current: 0
  },
  config: {
    itemsPerPage: 12
  }
})

export const mutations = {
  setSource(state:State, sourceName: string): void {
    const next = SourceMap.get(sourceName)
    if (next) {
      state.sourceName = sourceName
      state.source = next
    }
  },
  setMangaList(state: State, [list, total]): void {
    state.manga.list = list
    state.manga.total = total
    list.forEach(manga => {
      if (!state.manga.info[manga.id]) state.manga.info[manga.id] = manga
    })
  },
  setMangaInfo: (state: State, manga) => {
    if (manga && !state.manga.info[manga.id]) state.manga.info[manga.id] = manga
  },
  setMangaPage: (state: State, { id, pages }) => {
    state.manga.info[id].pages = pages
  },
  setCurrentId: (state: State, id) => {
    state.manga.currentId = id
  },
}

export const getters = {

  indexList: (state: State): string[] =>
    state && state.source ? state.source.index_list : [],

  mangaList: (state: State): Yomiko.MangaInfo[] =>
    state.manga.list,

  mangaInfo: (state: State): Yomiko.MangaInfo =>
    state.manga.info[state.manga.currentId],

  mangaLink: (state: State) => (info: Yomiko.MangaInfo): string =>
    state.source ? `/${state.sourceName}/${info.id}` : '/',

  maxPage: (state: State) =>
    state.manga.total ? Math.ceil(state.manga.total / state.config.itemsPerPage) : 1
}

export const actions = {
  async fetchMangaList({ commit, state }, { page, ...params }) {
    const response = await callApi({
      url: `${state.source.api_url}/mangas`,
      params: {
        // language: 'eq.korean',
        order: 'id.desc',
        ...makeParams(params),
      },
      page,
      itemsPerPage: state.config.itemsPerPage,
    })
    commit('setMangaList', response)
  },

  async fetchMangaInfo({ commit, state }, id) {
    const json = await callApi({
      url: `${state.source.api_url}/mangas`,
      params: { id: `eq.${id}` },
      single: true,
    })
    commit('setMangaInfo', json)
  },

  async fetchMangaPage({ commit, state, dispatch }, id) {
    commit('setCurrentId', id)
    if (!state.manga.info[id]) {
      await dispatch('fetchMangaInfo', id)
    }
    if (!state.manga.info[id].pages) {
      const [pages, total] = await callApi(`${state.source.api_url}/pages?mangaId=eq.${id}`)
      commit('setMangaPage', { id, pages })
    }
  },

  async nuxtServerInit({ commit }) {
  },
  select({ commit }, id) {
    commit('select', id)
  }
}
