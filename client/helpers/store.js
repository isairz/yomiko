import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import callApi from './callApi'

function makeParams(param, value) {
  switch (param) {
    case 'id':
    case 'name':
    case 'type':
    case 'language':
      return { [param]: `eq.${value}` }
    case 'author':
    case 'group':
    case 'character':
    case 'tag':
      return  { [param + 's']: `@>.{${value}}` }
    case 'series':
      return  { [param + 'es']: `@>.{${value}}` }
  }
}

const store = new Vuex.Store({
  state: {
    manga: {
      list: [],
      info: {},
      itemsPerPage: 12,
    },
  },
  actions: {
    // ensure data for rendering given list type
    FETCH_MANGA_LIST: ({ commit, state }, { param, value, page }) =>
      callApi('mangas', makeParams(param, value))
      .page(page, state.manga.itemsPerPage)
      .then(json => commit('SET_MANGA_LIST', json)),

    FETCH_MANGA: ({ commit }, id) =>
      callApi(`mangas?id=eq.${id}`)
      .then(json => commit('SET_MANGA', json)),
  },
  mutations: {
    SET_MANGA_LIST: (state, list) => {
      state.manga.list = list
      list.forEach(manga => {
        if (!state.manga.info[manga.id]) state.manga.info[manga.id] = manga
      })
    },

    SET_MANGA_PAGE: (state, { id, pages }) => {
      state.manga.info[id].pages = pages
    },
  },

  getters: {
    mangaList: state => state.manga.list,
    mangaInfo: state => id => state.manga.info[id],
  },
})

export default store
