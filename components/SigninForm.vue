<template>
  <div>
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
      <v-divider></v-divider>
      <span style="color: grey; font-size: 10px;">outras formas de login</span>
    </div>

    <v-btn
      class="mt-2"
      style="width: 100%;"
      @click="signInWithGoogle"
    >
      <v-icon color="grey-2">mdi-google</v-icon> Entrar com google 
    </v-btn>

    <div class="mt-5 my-2">
      <span style="color: grey; font-size: 10px;">Ainda não possui conta? <a @click.prevent="changeToSignup">Se cadastre agora</a></span>
    </div>
  </div>
</template>

<script>
import { GoogleAuthProvider } from 'firebase/auth'

export default {
  name: 'SigninForm',
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
        const provider = new GoogleAuthProvider();
        await this.$fire.auth.signInWithPopup(provider)
        this.$router.push('/posts')
      } catch(e) {
        console.log(e)
        alert('Desculpe ocorreu um erro ao tentar realizar o login')
      }
    },

    async signinWithForm(){
      this.$refs.signinForm.validate()
      if(this.valid) {
        try {
          await this.$fire.auth.signInWithEmailAndPassword(this.email, this.password)
          this.$router.push('/posts')
        } catch(e) {
          console.log(e)
          alert('Desculpe ocorreu um erro ao tentar realizar o login')
        }
      }
    },  

    changeToSignup(){
      this.$emit('changeToSignup')
    }
  },
  mounted(){
    console.log(this.$fire.auth.currentUser)
  }
}
</script>