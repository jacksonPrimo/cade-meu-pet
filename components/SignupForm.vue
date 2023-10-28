<template>
  <div>
    <v-form ref="signupForm" v-model="valid">
      <v-container>
        <v-row>
          <v-text-field
            solo
            dense
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
            dense
            prepend-inner-icon="mdi-account"
            v-model="name"
            :rules="nameRules"
            label="Nome Completo"
            required
          ></v-text-field>
        </v-row>

        <v-row>
          <v-text-field
            solo
            dense
            v-model="password"
            :rules="passwordRules"
            label="Password"
            prepend-inner-icon="mdi-lock-outline"
            required
          ></v-text-field>
        </v-row>

        <v-row>
          <v-text-field
            solo
            dense
            v-model="passwordConfirmation"
            :rules="passwordConfirmationRules"
            label="Password Confirmation"
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
            @click="signupWithForm"
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
      @click="signUpWithGoogle"
    >
      <v-icon color="grey-2">mdi-google</v-icon> Entrar com google 
    </v-btn>

    <div class="mt-5 my-2">
      <span style="color: grey; font-size: 10px;">Já possui uma conta? <a @click.prevent="changeToSignin">Entre agora</a></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignupForm',
  data: () => ({
    valid: false,
    name: '',
    nameRules: [
      value => {
        if (value) return true
        return 'O nome é necessária'
      },
    ],
    password: '',
    passwordRules: [
      value => {
        if (value) return true
        return 'A senha é necessária'
      },
    ],
    passwordConfirmation: '',
    passwordConfirmationRules: [
      value => {
        if (value) return true
        return 'A confirmação de senha é necessária'
      },
      value => {
        if (value !== '') return true
        return 'As senhas não coincidem'
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
    async signUpWithGoogle() {
      try {
        var provider = new this.$fireModule.auth.GoogleAuthProvider();
        const auth = await this.$fire.auth.signInWithPopup(provider)
        const authData = auth.user.multiFactor.user
        this.finishSignup(authData)
      } catch(e) {
        console.log(e)
      }
    },

    async signupWithForm(){
      this.$refs.signupForm.validate()
      if(this.valid) {
        try {
          const auth = await this.$fire.auth.createUserWithEmailAndPassword(
            this.email,
            this.password
          )
          const authData = auth.user.multiFactor.user
          this.finishSignup(authData)
        } catch(e) {
          this.signinError = true
          console.log(e)
        }
      }
    },
  
    finishSignup(authData){
      const params = {
        email: authData.email,
        name: authData.displayName
      }
      this.$fire.firestore.collection('users').doc(authData.uid).set(params)
      this.$router.push('/lost-and-found')
    },

    changeToSignin(){
      this.$emit('changeToSignin')
    }
  }
}
</script>