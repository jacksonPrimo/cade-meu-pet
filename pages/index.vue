<template>
  <div class="container-box grey lighten-3">
    <div class="box white">
      <v-row style="height: 100%;">
        <v-col class="text-center px-16 first-column">
          <div class="welcome">
            <span>
              Bem Vindo
            </span>
            <span>Ficamos felizes em vê-lo de volta conosco</span>
          </div>
          <SigninForm @changeToSignup="()=>signin = false" v-if="signin"></SigninForm>
          <SignupForm @changeToSignin="()=>signin = true" v-else></SignupForm>
        </v-col>
        <v-col class="second-column"></v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import SigninForm from '../components/SigninForm.vue'
import SignupForm from '../components/SignupForm.vue'

export default {
  components: {
    SigninForm,
    SignupForm,
  },
  data: () => ({
    signin: true,
  }),
  methods: {}
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
  min-height: 75%;
  border-radius: 20px;
  padding: 25px;
}

.first-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.welcome {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.welcome span:nth-child(1) {
  font-size: 55px;
  font-weight: bold;
}

.welcome span:nth-child(2) {
  font-size: 13px;
}

.second-column {
  border-radius: 20px;
  background-image: url("../static/images/login.jpg");
  /* Imagem de <a href="https://br.freepik.com/fotos-gratis/ai-gerado-de-cachorro-labrador-retriever_58598246.htm#query=cachorro&position=19&from_view=search&track=sph">Freepik</a> */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.v-input__slot {
  box-shadow: none !important;
  background-color: rgba(105, 105, 105, 0.123) !important;
  border-radius: 12px !important;
}

@media only screen and (min-width: 1600px) {
  .box {
    width: 80%;
    min-height: 67%;
  }
}

@media only screen and (max-width: 960px) {
  .second-column {
    display: none;
  }
}
</style>