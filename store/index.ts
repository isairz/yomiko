import axios from '~plugins/axios'
import callApi, { makeParams } from './callApi'

export const state = () => ({
  manga: {
    list: [],
    info: {},
    current: 0,
    itemsPerPage: 12
  }
})

export const mutations = {
  setMangaList(state, list) {
    state.manga.list = list
    list.forEach(manga => {
      if (!state.manga.info[manga.id]) state.manga.info[manga.id] = manga
    })
  },
  setMangaInfo: (state, manga) => {
    if (manga && !state.manga.info[manga.id]) state.manga.info[manga.id] = manga
  },
  setMangaPage: (state, { id, pages }) => {
    state.manga.info[id].pages = pages
  },
  setCurrentId: (state, id) => {
    state.manga.current = id
  },
}

export const getters = {
  mangaList: state => {
    return state.manga.list
  },
  mangaInfo: state => {
    return state.manga.info[state.manga.current];
  }
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
      const json = await callApi(`pages?mangaId=eq.${id}`)
      commit('setMangaPage', { id, pages: json })
    }
  },

  async nuxtServerInit({ commit }) {
  },
  select({ commit }, id) {
    commit('select', id)
  }
}
