<template>
  <v-row>
    <v-col cols="6">
      <img src="images/preferences.svg">
      <!-- <a href="https://br.freepik.com/vetores-gratis/ilustracao-do-conceito-de-processamento_7126211.htm#query=config&position=9&from_view=search&track=sph&uuid=69198325-e013-401a-8c54-941a64a8a532">Imagem de storyset</a> no Freepik -->
    </v-col>
    <v-col cols="6" class="px-16">
      <v-form ref="accountPreferenceForm" v-model="valid">
        <div class="input-image">
          <img :src="profileImage ? profileImage : 'images/profile.svg'" class="profile-image">
          <v-file-input
            prepend-icon="mdi-camera"
            accept="image/*"
            label="File input"
            v-model="imageFile"
          ></v-file-input>
          <!-- <a href="https://br.freepik.com/vetores-gratis/ilustracao-do-conceito-de-processamento_7126211.htm#query=config&position=9&from_view=search&track=sph&uuid=69198325-e013-401a-8c54-941a64a8a532">Imagem de storyset</a> no Freepik -->
        </div>

        <v-text-field
          v-if="authType == 'emailAndPassword'"
          solo
          prepend-inner-icon="mdi-email"
          v-model="email"
          :rules="[(value) => value ? true : 'Email é um campo obrigatório']"
          label="Email"
          required
        ></v-text-field>

        <v-text-field
          solo
          prepend-inner-icon="mdi-account"
          v-model="name"
          :rules="[value => value ? true : 'Nome é um campo obrigatório']"
          label="Nome"
          required
        ></v-text-field>

        <v-text-field
          solo
          prepend-inner-icon="mdi-phone"
          v-model="phone"
          label="Telefone de contato"
          required
        ></v-text-field>

        <v-text-field
          v-if="authType == 'emailAndPassword'"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          prepend-inner-icon="mdi-lock"
          label="Senha"
          required
          solo
        ></v-text-field>

        <v-text-field
          v-if="authType == 'emailAndPassword'"
          :rules="
            this.password ? [
              value => value ? true : 'Confirmação é obrigatória',
              value => value == password ? true : 'Os campos não coincidem'
            ] : []
          "
          v-model="passwordConfirmation"
          :type="showConfirmPassword ? 'text' : 'password'"
          @click:append="showConfirmPassword = !showConfirmPassword"
          :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          prepend-inner-icon="mdi-lock"
          label="Confirmar senha"
          required
          solo
        ></v-text-field>

        <v-btn
          color="grey darken-4"
          @click="submit"
          style="width: 100%; color: white"
        >
          Atualizar
        </v-btn>
      </v-form>

      <v-switch
        v-model="theme"
        label="Tema escuro"
      ></v-switch>

      <v-switch
        v-model="notifications"
        label="Ativar notificações"
      ></v-switch>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'AdoptionPage',
  layout: "authenticated",
  name: 'SigninForm',
  data: () => ({
    valid: false,
    authType: "emailAndPassword",
    showPassword: false,
    showConfirmPassword: false,
    theme: false,
    notifications: false,
    imageFile: null,
    name: '',
    phone: '',
    email: '',
    profileImage: '',
    password: '',
    passwordConfirmation: '',
  }),
  mounted(){
    const user = this.$fire.auth.currentUser
    this.email = user.email
    this.$fire.firestore.collection('users').doc(user.uid).get().then(result=> {
      const data = result.data()
      if(data) {
        this.name = data.name
        this.phone = data.phone
      }
    })
  },
  methods: {
    submit(){
      this.$refs.accountPreferenceForm.validate()
      if(this.valid){ 
        this.changeEmail()
        this.changePassword()
        this.updateUser()
      }
    },
    changePassword(){
      if(this.password && this.confirmPassword) {
        try {
          this.$fire.auth.currentUser.updatePassword(this.password)
        } catch(e) {
          console.log(e)
        }
      }
    },
    async changeEmail(){
      try {
        if(this.email && this.email !== this.$fire.auth.currentUser.email) {
          await this.$fire.auth.currentUser.verifyBeforeUpdateEmail(this.email)
          alert('enviamos um link de confirmação para este novo email')
        }
      } catch(e) {
        console.log(e)
      }
    },
    async updateUser(){
      try {
        const result = await this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid).set({
          name: this.name,
          phone: this.phone,
        })
        console.log(result)
      } catch(e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss">
.input-image {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>