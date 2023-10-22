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
          <v-form ref="signinForm" v-model="valid">
            <v-container>
              <v-row>
                <v-text-field
                  solo
                  prepend-inner-icon="mdi-email"
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                ></v-text-field>
              </v-row>
              <v-row>
                <v-text-field
                  solo
                  v-model="password"
                  :rules="passwordRules"
                  label="Password"
                  prepend-inner-icon="mdi-lock-outline"
                  required
                ></v-text-field>
              </v-row>
              <v-row v-if="signinError">
                <span class="error--text">Usuario ou senha inválidos</span>
              </v-row>
              <v-row>
                <v-btn
                  :disabled="!valid"
                  color="grey darken-4"
                  style="width: 100%; color: white"
                  @click="signinWithForm"
                >
                  Entrar
                </v-btn>
              </v-row>
            </v-container>
          </v-form>

          <div class="mt-5 my-2">
            <v-divider>aa</v-divider>
            <span style="color: grey; font-size: 10px;">outras formas de login</span>
          </div>

          <v-btn
            class="mt-2"
            style="width: 100%;"
            @click="signInWithGoogle"
          >
            <v-icon color="grey-2">mdi-google</v-icon> Entrar com google 
          </v-btn>
        </v-col>
        <v-col class="second-column"></v-col>
      </v-row>
    </div>
  </div>
</template>

<script>

export default {
  data: () => ({
    valid: false,
    password: '',
    passwordRules: [
      value => {
        if (value) return true
        return 'Password is required.'
      },
    ],
    email: '',
    emailRules: [
      value => {
        if (value) return true

        return 'E-mail is required.'
      },
      value => {
        if (/.+@.+\..+/.test(value)) return true

        return 'E-mail must be valid.'
      },
    ],
    signinError: false
  }),
  methods: {
    async signInWithGoogle() {
      try {
        var provider = new this.$fireModule.auth.GoogleAuthProvider();
        let authData = await this.$fire.auth.signInWithPopup(provider)
        this.finishSign()
      } catch(e) {
        console.log(e)
      }
    },

    async signinWithForm(){
      this.$refs.signinForm.validate()
      if(this.valid) {
        try {
          const result = await this.$fire.auth.signInWithEmailAndPassword(
            this.email,
            this.password
          )
          console.log(result)
          this.finishSign()
        } catch(e) {
          this.signinError = true
          console.log(e)
        }
      }
    },
  
    finishSign(){
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
}
</style>