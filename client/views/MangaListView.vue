<template>
  <section class="section">
    <div class="container">
      <manga-list :items="items"></manga-list>
      <nav class="pagination">
        <ul>
          <li v-if="page > 1"><router-link class="button" :to="{ query: { page: 1 } }" exact>«</router-link></li>
          <li v-for="p in pagination"><router-link class="button" :to="{ query: { page: p } }" exact>{{ p }}</router-link></li>
          <li v-if="hasMore"><router-link class="button" :to="{ query: { page: maxPage } }" exact>»</router-link></li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import MangaList from '../components/MangaList.vue'
export default {
  name: 'App',
  components: {
    MangaList,
  },

  computed: {
    page () {
      return 5
      return Number(this.$store.state.route.query.page) || 1
    },
    maxPage () {
      return 20
      const { itemsPerPage, list } = this.$store.state.manga
      return Math.ceil(list.length / itemsPerPage)
    },
    pagination () {
      const from = Math.max(this.page - 5, 1)
      const to = Math.min(this.page + 5, this.maxPage)
      return Array.from(Array(to - from + 1), (_, i) => (from + i))
    },
    hasMore () {
      return this.page < this.maxPage
    },
  },
  data () {
    return {
      /* eslint-disalbe */
      items: [{"id":980555,"name":"Made fur 3","authors":["ransyou equals zero"],"groups":["096"],"type":"doujinshi","language":"japanese","serieses":null,"characters":null,"tags":["male:furry","male:males only","male:yaoi"],"thumbnail":"1.jpg","createdAt":"2016-09-27T22:39:20.136+09:00","updatedAt":"2016-09-29T21:51:09.721+09:00"},{"id":980541,"name":"Step Child Swapping","authors":["satsuki imonet"],"groups":null,"type":"manga","language":"russian","serieses":null,"characters":null,"tags":["female:big breasts","female:daughter","female:loli","female:milf","female:mother","incest","inseki","male:shota","mosaic censorship"],"thumbnail":"1.png","createdAt":"2016-09-27T22:39:20.15+09:00","updatedAt":"2016-09-29T21:51:09.732+09:00"},{"id":980535,"name":"Hitozuma Daisuki! Hiroyuki-kun","authors":["chin"],"groups":null,"type":"manga","language":"russian","serieses":null,"characters":null,"tags":["female:apron","female:big breasts","female:milf","female:nakadashi","male:bbm"],"thumbnail":"1.png","createdAt":"2016-09-27T22:39:20.167+09:00","updatedAt":"2016-09-29T21:51:09.741+09:00"},{"id":980343,"name":"Mei wa 〇nensei JS4 Hen","authors":["suzuki amaharu"],"groups":["jibaku-system"],"type":"doujinshi","language":"japanese","serieses":null,"characters":null,"tags":["female:anal","female:daughter","female:loli","female:niece","female:randoseru","female:scat","female:sole female","female:stockings","incest","male:sole male","mosaic censorship"],"thumbnail":"1.jpg","createdAt":"2016-09-27T22:39:20.187+09:00","updatedAt":"2016-09-29T21:51:09.771+09:00"},{"id":980528,"name":"Wakuwaku One-sans ch. 1-5","authors":["john k. pe-ta"],"groups":null,"type":"manga","language":"russian","serieses":null,"characters":null,"tags":["female:big breasts","female:nakadashi","female:x-ray","uncensored"],"thumbnail":"001_01.png","createdAt":"2016-09-27T22:39:20.215+09:00","updatedAt":"2016-09-29T21:51:09.779+09:00"},{"id":980516,"name":"After Festival","authors":["okara"],"groups":["aspergillus"],"type":"doujinshi","language":"russian","serieses":["toaru kagaku no railgun"],"characters":["mikoto misaka","touma kamijou"],"tags":["female:sole female","male:sole male"],"thumbnail":"1.png","createdAt":"2016-09-27T22:39:20.312+09:00","updatedAt":"2016-09-29T21:51:09.82+09:00"},{"id":980464,"name":"Classmate Nyuugaku Shashin 2 Rijichou Sensei to Issho ni Satsuei Kai","authors":["ohigetan"],"groups":["circle ohigetan"],"type":"doujinshi","language":"english","serieses":null,"characters":null,"tags":["female:big breasts","female:blowjob","female:bukkake","female:lactation","female:paizuri","full color","group"],"thumbnail":"1.jpg","createdAt":"2016-09-27T22:39:20.397+09:00","updatedAt":"2016-09-29T21:51:09.877+09:00"},{"id":980493,"name":"ANOTHER ONE","authors":["yanagi hirohiko"],"groups":["akkan-bi project"],"type":"doujinshi","language":"spanish","serieses":["dead or alive"],"characters":["kasumi"],"tags":["female:big breasts","female:bondage","female:cervix penetration","female:x-ray"],"thumbnail":"1.png","createdAt":"2016-09-27T22:39:20.343+09:00","updatedAt":"2016-09-29T21:51:09.84+09:00"},{"id":980474,"name":"Si-Eun Ch.0-34","authors":null,"groups":null,"type":"doujinshi","language":"korean","serieses":null,"characters":null,"tags":["full color","story arc","webtoon"],"thumbnail":"001_Si_Eun.jpg","createdAt":"2016-09-27T22:39:20.353+09:00","updatedAt":"2016-09-29T21:51:09.849+09:00"},{"id":980422,"name":"Oniyuri no Hanakotoba","authors":["nekomata naomi"],"groups":["nekomataya"],"type":"doujinshi","language":"french","serieses":["kantai collection"],"characters":["tatsuta","tenryuu"],"tags":["female:big breasts","female:blowjob","female:eyepatch","female:futanari","female:sole dickgirl","female:sole female","female:stockings","female:x-ray"],"thumbnail":"1.jpg","createdAt":"2016-09-27T22:39:20.419+09:00","updatedAt":"2016-09-29T21:51:09.892+09:00"},{"id":978585,"name":"Tamaya Roppatsume","authors":["yukino minato"],"groups":["noraneko-no-tama"],"type":"doujinshi","language":"japanese","serieses":null,"characters":null,"tags":["female:loli"],"thumbnail":"1.jpg","createdAt":"2016-09-27T22:39:40.955+09:00","updatedAt":"2016-09-29T21:50:25.615+09:00"},{"id":978374,"name":"Hari's Lumpy Sharehouse Ch.0-10","authors":null,"groups":null,"type":"doujinshi","language":"korean","serieses":null,"characters":null,"tags":["full color","story arc","webtoon"],"thumbnail":"001_Haris_lumpy_sharehouse.jpg","createdAt":"2016-09-27T22:39:45.1+09:00","updatedAt":"2016-09-29T21:50:25.78+09:00"}]
      /* eslint-enable */
    }
  },
}
</script>

<style lang="sass" scoped>
  .pagination
    margin-top: 20px
</style>
