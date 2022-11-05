import axios from 'axios'

const ContentRangeStructure = /^(\d+)-(\d+)\/(\d+)$/

export default function callApi (options) {
  if (typeof options === 'string') options = { url: options }
  options.headers = options.headers || {}

  // pagination
  if (options.page && options.itemsPerPage) {
    const to = (options.page || 1) * options.itemsPerPage - 1
    const from = to - options.itemsPerPage + 1
    // options.headers['Range-Unit'] = 'items'
    options.headers['Range'] = `${from || 0}-${to || ''}`
  }

  console.log(options)

  // single
  if (options.single) {
    options.headers['Prefer'] = 'plurality=singular'
  }

  return axios(options)
  .then(res => {
    const contentRange = res.headers['content-range']
    const json = res.data
    if (json && Array.isArray(json) && contentRange) {
      const range = ContentRangeStructure.exec(contentRange)
      if (range) {
        // const start = parseInt(range[1])
        // const end = parseInt(range[2])
        const total = parseInt(range[3])
        return [json, total]
      }
    }
    return json
  })
}

export function makeParams (filters): Yomiko.FilterParams {
  let params: Yomiko.FilterParams = {}

  for (let key in filters) {
    const value = filters[key]
    switch (key) {
      case 'id':
      case 'name':
      case 'type':
      case 'language':
        params[key] = `eq.${value}`
        break
      case 'author':
      case 'group':
      case 'character':
      case 'tag':
        params[key + 's'] = `@>.{${value}}`
        break
      case 'series':
        params[key + 'es'] = `@>.{${value}}`
        break
    }
  }
  return params
}
