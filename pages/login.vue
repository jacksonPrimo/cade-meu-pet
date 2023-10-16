<template>
  <div class="container-box">
    <div class="box">
      <v-row>
        <v-col class="red text-center">
          <v-btn @click="signInWithGoogle" color="primary" class="ma-2">Sign in with Google</v-btn>
        </v-col>
        <v-col class="purple text-center">2</v-col>
      </v-row>
    </div>
  </div>
</template>

<script>

export default {
  data: () => ({
  }),
  async mounted(){
    console.log(process.env.API_KEY)
  },
  methods: {
    async signInWithGoogle() {
      var provider = new this.$fireModule.auth.GoogleAuthProvider();
      let authData = await this.$fire.auth.signInWithPopup(provider)
      this.$router.push('/profile')
    }
  }
}
</script>

<style>
.container-box {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  width: 90%;
  height: 80%;
  border-radius: 20px;
}
</style>