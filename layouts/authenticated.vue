<template>
  <v-app dark>
    <v-app-bar
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
          <v-icon>{{item.icon}}</v-icon>
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
      <div style="padding: 10px 20px">
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
      </v-list>
    </v-navigation-drawer>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>
<script>

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
          title: 'Postagens',
          to: '/posts'
        },
        {
          icon: 'mdi-account-cog-outline',
          title: 'Preferências',
          to: '/accountPreferences'
        },
      ],
      title: 'Pet Connection'
    }
  },
  async beforeMount(){
    if(!this.$fire.auth.currentUser) this.$router.push('/')
    const dark = !!localStorage.getItem('dark')
    this.$vuetify.theme.dark = dark
  },
  methods: {
    logout(){
      this.$fire.auth.signOut()
      this.$router.push('/')
    }
  }
}
</script>
<style lang="scss">
  @media only screen and (min-width: 800px) {
    .mobile-menu {
      display: none;
    }
  }
  @media only screen and (max-width: 800px) {
    .desktop-menu {
      display: none;
    }
  }
</style>