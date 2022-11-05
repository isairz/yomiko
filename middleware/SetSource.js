import SourceMap from '../api/SourceMap'

export default function ({ route, store, error }) {
  if (route.params.site) {
    if (SourceMap.has(route.params.site)) {
      store.commit('setSource', route.params.site || null)
    } else {
      error({
        statusCode: 404,
        message: 'Invalid source site'
      })
    }
  }
}
