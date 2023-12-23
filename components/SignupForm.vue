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
            :rules="[
              value => value ? true : 'Nome é obrigatório',
            ]"
            label="Nome Completo"
            required
          ></v-text-field>
        </v-row>

        <v-row>
          <v-text-field
            v-model="password"
            :rules="[
              value => value ? true : 'A senha é obrigatória',
            ]"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            prepend-inner-icon="mdi-lock"
            label="Password"
            required
            solo
            dense
          ></v-text-field>
        </v-row>

        <v-row>
          <v-text-field
            v-model="passwordConfirmation"
            :rules="[
              value => value ? true : 'Confirmação é obrigatória',
              value => value == password ? true : 'Os campos não coincidem'
            ]"
            :type="showConfirmPassword ? 'text' : 'password'"
            @click:append="showConfirmPassword = !showConfirmPassword"
            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            prepend-inner-icon="mdi-lock"
            label="Password Confirmation"
            required
            solo
            dense
          ></v-text-field>
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
    showPassword: false,
    showConfirmPassword: false,
    name: '',
    password: '',
    passwordConfirmation: '',
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
  }),
  methods: {
    async signUpWithGoogle() {
      var provider = new this.$fireModule.auth.GoogleAuthProvider();
      const { credential } = await this.$fire.auth.signInWithPopup(provider)        
      const response = await this.$axios.post('auth/signinWithGoogle', { token: credential.accessToken })
      if(response.status == 200) {
        this.finishSignup(response)
      } else {
        alert(response.message || 'Desculpe ocorreu um erro ao tentar realizar o cadastro')
      }
    },

    async signupWithForm(){
      this.$refs.signupForm.validate()
      if(this.valid) {
        const response = await this.$axios.post('auth/signup', {
          email: this.email,
          name: this.name,
          password: this.password
        })
        if(response.status == 200) {
          this.finishSignup(response)
        } else {
          alert(response.message || 'Desculpe ocorreu um erro ao tentar realizar o cadastro')
        }
      }
    },
  
    finishSignup(response){
      localStorage.setItem('authToken', response.data.accessToken)
      this.$router.push('/posts')          
    },

    changeToSignin(){
      this.$emit('changeToSignin')
    }
  }
}
</script>