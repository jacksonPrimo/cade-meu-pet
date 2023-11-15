<template>
  <v-app>
    <Nuxt />
  </v-app>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'DefaultLayout',
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
    })
  },
  async beforeMount(){
    this.$store.dispatch('auth/initialState')
    const authenticated = await this.authenticated
    if(authenticated) this.$router.push('/lost-and-found')
  },
}
</script>
