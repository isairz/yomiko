<template>
  <div>
    <div>
      <section class="hero is-info">
        <div class="hero-body">
          <div class="container has-text-centered">
            <nuxt-link to="/scrap">
              <div class="logo"/>
            </nuxt-link>
            <h1 class="title">
              Yomiko
            </h1>
            <h2 class="subtitle">
              Who is beloved by paper(kami)
            </h2>
          </div>
        </div>
      </section>
    </div>

    <div class="container">
      <h3>요미코는?</h3>

      <dl>
        <dt>만화 뷰어</dt>
        <dd>
          간단히 말해서 편리한 만화뷰어에요.
        </dd>
        <dt>사용법</dt>
        <dd>
          위의 요미코 아이콘을 누르고 사용해요.
        </dd>
        <dd>
          모바일 크롬의 경우 [메뉴 - 홈 화면에 추가] 를 해두시면 편리해요.
        </dd>
      </dl>
    </div>
  </div>
</template>

<style lang="sass">
$cyan: #33e0ff
.logo
  $size: 300px
  margin: auto
  height: $size
  width: $size
  border-radius: $size / 2
  border: 1px solid $cyan
  box-shadow: inset 0 0 10px $cyan
  vertical-align: middle
  background: url('~assets/yomiko.jpg') no-repeat center center
  background-size: cover
</style>


