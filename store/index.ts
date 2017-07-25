import axios from '~plugins/axios'
import callApi, { makeParams } from './callApi'

type State = {
  manga: {
    list: Yomiko.MangaInfo[]
    total: number
    info: Yomiko.MangaInfo,
    current: number,
    itemsPerPage: number
  }
}

export const state = () => ({
  manga: {
    list: [],
    total: 0,
    info: {},
    current: 0,
    itemsPerPage: 12
  }
})

export const mutations = {
  setMangaList(state: State, [list, total]) {
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
    state.manga.current = id
  },
}

export const getters = {
  mangaList: (state: State): Yomiko.MangaInfo[] =>
    state.manga.list,

  mangaInfo: (state: State): Yomiko.MangaInfo =>
    state.manga.info[state.manga.current],

  maxPage: (state: State) =>
    state.manga.total ? Math.ceil(state.manga.total / state.manga.itemsPerPage) : 1
}

export const actions = {
  async fetchMangaList({ commit, state }, { page, ...params }) {
    const response = await callApi({
      url: 'mangas',
      params: {
        language: 'eq.korean',
        order: 'id.desc',
        ...makeParams(params),
      },
      page,
      itemsPerPage: state.manga.itemsPerPage,
    })
    commit('setMangaList', response)
  },

  async fetchMangaInfo({ commit, state }, id) {
    const json = await callApi({
      url: `mangas`,
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
      const [pages, total] = await callApi(`pages?mangaId=eq.${id}`)
      commit('setMangaPage', { id, pages })
    }
  },

  async nuxtServerInit({ commit }) {
  },
  select({ commit }, id) {
    commit('select', id)
  }
}
