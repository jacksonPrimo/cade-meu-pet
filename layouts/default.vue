<template>
  <v-app>
    <Nuxt />
  </v-app>
</template>
<script>
export default {
  name: 'DefaultLayout',
  beforeMount(){
    const dark = !!localStorage.getItem('dark')
    this.$vuetify.theme.dark = dark
  }
}
</script>
