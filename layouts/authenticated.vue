<template>
  <v-app dark>
    <v-app-bar
      style="z-index: 5000;"
      elevation="0"
      fixed
      app
    >
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <div class="desktop-menu">
        <v-btn 
          v-for="(item, i) in items"
          plain 
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-icon class="mr-1">{{item.icon}}</v-icon>
          <span>{{item.title}}</span>
        </v-btn>

        <v-btn 
          plain 
          router
          exact
          color="red"
          @click="logout"
        >
          <v-icon>mdi-exit-to-app</v-icon>
          <span>Sair</span>
        </v-btn>
      </div>
      <v-app-bar-nav-icon class="mobile-menu" @click.stop="drawer = !drawer" />
    </v-app-bar>
    <v-main>
      <div class="main-container">
        <Nuxt/>
      </div>
    </v-main>
    <v-navigation-drawer
      class="mobile-menu"
      v-model="drawer"
      :mini-variant="false"
      :right="true"
      fixed
      temporary
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router exact @click="logout">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title color="red">Sair</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer app style="z-index: 5000;">
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>
<script>
import { authenticated, logout } from '@/utils/auth'

export default {
  name: 'AuthenticatedLayout',
  data () {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-cat',
          title: 'Anunciar',
          to: '/createPost'
        },
        {
          icon: 'mdi-paw',
          title: 'Publicações',
          to: '/posts'
        },
        {
          icon: 'mdi-list-box-outline',
          title: 'Minhas Publicações',
          to: '/myPosts'
        },
        {
          icon: 'mdi-account-cog-outline',
          title: 'Preferências',
          to: '/preferences'
        },
      ],
      title: 'PET CONNECTION'
    }
  },
  async beforeMount(){
    if(!authenticated()) this.$router.push('/')

    const dark = !!localStorage.getItem('dark')
    this.$vuetify.theme.dark = dark
  },
  methods: {
    logout(){
      logout()
      this.$router.push('/')
    }
  }
}
</script>
<style lang="scss">
  .main-container {
    padding: 10px 20px;
  }
  .leaflet-control-geosearch .results > * {
    color: black !important
  }
  .mobile-menu {
    z-index: 5000;
  }
  @media only screen and (min-width: 800px) {
    .mobile-menu {
      display: none;
    }
  }
  @media only screen and (max-width: 800px) {
    .main-container {
      padding: 0px;
    }
    .desktop-menu {
      display: none;
    }
  }
</style>