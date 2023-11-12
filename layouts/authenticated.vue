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
          value="recent" 
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
          value="recent" 
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
      <v-container>
        <Nuxt />
      </v-container>
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
import { mapGetters } from 'vuex'

export default {
  name: 'AuthenticatedLayout',
  data () {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-paw',
          title: 'Achados e Perdidos',
          to: '/lost-and-found'
        },
        {
          icon: 'mdi-rabbit-variant-outline',
          title: 'Adoção',
          to: '/adoption'
        },
        {
          icon: 'mdi-account-cog-outline',
          title: 'Preferências',
          to: '/account-preferences'
        },
      ],
      title: 'Cadê Meu Pet?'
    }
  },
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
    })
  },
  async beforeMount(){
    this.$store.dispatch('auth/initialState')
    const authenticated = await this.authenticated
    if(!authenticated) this.$router.push('/')
  },
  methods: {
    logout(){
      this.$store.dispatch('auth/signOut')
      this.$router.push('/')
    }
  }
}
</script>
<style lang="scss">
  @media only screen and (min-width: 600px) {
    .mobile-menu {
      display: none;
    }
  }
  @media only screen and (max-width: 600px) {
    .desktop-menu {
      display: none;
    }
  }
</style>