require('babel/polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: 'React Redux Example',
    description: 'All the modern best practices in one example.',
    meta: {
      charSet: 'utf-8',
      property: {
        'og:site_name': 'Project Yomiko',
        'og:image': '/favicon.png',
        'og:locale': 'ko_KR',
        'og:title': 'Project Yomiko',
        'og:description': 'A Beatiful Web MangaViewer.',
        'twitter:card': 'summary',
        'twitter:site': '@prev_ious',
        'twitter:creator': '@prev_ious',
        'twitter:title': 'Project Yomiko',
        'twitter:description': 'A Beatiful Web MangaViewer.',
        'twitter:image': 'https://react-redux.herokuapp.com/logo.jpg',
        'twitter:image:width': '200',
        'twitter:image:height': '200',
      }
    }
  }
}, environment);
