const SourceMap: Map<string, Yomiko.Source> = new Map<string, Yomiko.Source>()

SourceMap.set('hitomi', {
  name: 'Hitomi',
  favicon: 'https://ltn.hitomi.la/favicon-192x192.png',
  api_url: 'https://yomiko4.isair.kr/api',
  index_list: [
    'tag',
    'artist',
    'series',
    'character'
  ],

  getThumbnail (info: Yomiko.MangaInfo) {
    return `//tn.hitomi.la/smalltn/${info.id}/${info.thumbnail}.jpg`
  },
  getPage (id, name, page) {
    // const numberOfFrontends = 7
    // const sub = String.fromCharCode(97 + (id % numberOfFrontends))
    // const sub = 'la'
    // return `https://${sub}.hitomi.la/galleries/${id}/${name}`
    return `https://yomiko4.isair.kr/galleries/${id}/${name}` 
  }
})

export default SourceMap