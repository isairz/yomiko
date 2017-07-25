module.exports = {
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },
  head: {
    title: 'Project Yomiko!',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  css: [
    'font-awesome/scss/font-awesome.scss',
    '~assets/css/bulma.sass',
    '~assets/css/main.sass'
  ],
  build: {
    vendor: ['axios', 'vuex-class', 'nuxt-class-component']
  },

  plugins: ['~plugins/filters.js'],
  modules: ['~modules/typescript.ts']
}
