<template>
  <div>
    <nav class="nav is-shadow">
      <div class="container ">
        <div class="navbar-brand">
          <nuxt-link to="/" class="navbar-item is-brand is-bold">
            Project Yomiko
          </nuxt-link>

          <a class="navbar-item is-hidden-desktop" href="https://twitter.com/prev_ious" target="_blank">
            <span class="icon" style="color: #55acee;">
              <i class="fa fa-twitter"></i>
            </span>
          </a>

          <div class="navbar-burger burger" data-target="navMenuExample">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navMenuExample" class="navbar-menu">
          <div class="navbar-start">
            <nuxt-link to="/manga" class="navbar-item">
              Recently
            </nuxt-link>
            <nuxt-link to="/tag" class="navbar-item">
              Tag
            </nuxt-link>
            <nuxt-link to="/artist" class="navbar-item">
              Artist
            </nuxt-link>
            <nuxt-link to="/artist" class="navbar-item">
              Series
            </nuxt-link>
            <nuxt-link to="/character" class="navbar-item">
              Character
            </nuxt-link>
            <div class="navbar-item has-dropdown is-hoverable">
              <nuxt-link to="/manga" class="navbar-link" href="/documentation/overview/start/">
                Config
              </nuxt-link>
              <div class="navbar-dropdown ">
                <a class="navbar-item " href="/documentation/overview/start/">
                  Overview
                </a>
                <a class="navbar-item " href="http://bulma.io/documentation/modifiers/syntax/">
                  Modifiers
                </a>
                <a class="navbar-item " href="http://bulma.io/documentation/grid/columns/">
                  Grid
                </a>
                <a class="navbar-item " href="http://bulma.io/documentation/elements/box/">
                  Elements
                </a>
                
                  <a class="navbar-item is-active" href="http://bulma.io/documentation/components/breadcrumb/">
                    Components
                  </a>
                
                <a class="navbar-item " href="http://bulma.io/documentation/layout/container/">
                  Layout
                </a>
                <hr class="navbar-divider">
                <div class="navbar-item">
                  <div>version <p class="has-text-info">0.4.3</p></div>
                </div>
              </div>
            </div>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="field">
                <p class="control has-icons-left">
                  <input class="input" type="text" placeholder="Search" value="">
                  <span class="icon is-small is-left">
                    <i class="fa fa-search"></i>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <nuxt/>

    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <p>&copy; 2014-2017 &middot; R.O.D</p>
          </p>
          <p>
            <p>We are on Twitter <a href='https://twitter.com/@prev_ious' target='_Blank'>@prev_ious</a></p>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
