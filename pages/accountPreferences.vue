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
          <!-- <a href="https://br.freepik.com/vetores-gratis/ilustracao-do-conceito-de-processamento_7126211.htm#query=config&position=9&from_view=search&track=sph&uuid=69198325-e013-401a-8c54-941a64a8a532">Imagem de storyset</a> no Freepik -->
        </div>
        <v-file-input
          solo
          prepend-icon=""
          prepend-inner-icon="mdi-camera"
          accept="image/*"
          label="File input"
          v-model="imageFile"
        ></v-file-input>

        <v-text-field
          v-if="authType == 'emailAndPassword'"
          solo
          prepend-inner-icon="mdi-email"
          v-model="email"
          :rules="[value => value ? true : 'Email é um campo obrigatório']"
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
          :disabled="loading"
          style="width: 100%; color: white"
        >
          Atualizar
        </v-btn>
      </v-form>

      <v-switch
        v-model="darkTheme"
        label="Tema escuro"
        @change="changeDarkTheme"
      ></v-switch>
      
      <v-switch
        v-model="notifications"
        label="Ativar notificações"
        @change="changeActiveNotifications"
      ></v-switch>

      <v-btn v-if="notifications" outlined color="blue darken-2" @click="openModal = true">
        <v-icon color="blue darken-2">mdi-map</v-icon>
        Endereço para o foco das notificações
      </v-btn>

      <v-dialog
        v-model="openModal"
        persistent
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5 mr-auto">Escolha um endereço</span>
            <v-btn
              color="blue darken-1"
              text
              @click="closeModal"
            >
              <v-icon dark>
                mdi-close
              </v-icon>
            </v-btn> 
          </v-card-title>
          <v-card-text>
            <selectable-map @markLocation="markLocation"></selectable-map>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import { uploadImage } from '@/utils/image'
import SelectableMap from '@/components/selectableMap.vue'

export default {
  name: 'AccountPreferences',
  layout: "authenticated",
  components: {
    SelectableMap
  },
  data: () => ({
    valid: false,
    openModal: false,
    loading: false,
    authType: "google",
    showPassword: false,
    showConfirmPassword: false,
    darkTheme: false,
    notifications: false,
    imageFile: null,
    name: '',
    phone: '',
    email: '',
    profileImage: '',
    password: '',
    passwordConfirmation: '',
    notificationAddress: {
      lat: '',
      lng: ''
    }
  }),
  mounted(){
    const user = this.$fire.auth.currentUser
    this.checkIfUserHasPassword(user)
    this.email = user.email
    this.$fire.firestore.collection('users').doc(user.uid).get().then(result=> {
      const data = result.data()
      if(data) {
        this.name = data.name || ''
        this.phone = data.phone || ''
        this.profileImage = data.profileImage || ''
        this.notifications = data.notificationToken || false
        this.notificationAddress = data.notificationAddress
      }
    })
    this.darkTheme = !!localStorage.getItem('dark')
  },
  methods: {
    checkIfUserHasPassword(user){
      const providers = user.providerData || []
      const hasPassword = providers.some(p => p.providerId == 'password')
      this.authType = hasPassword ? 'emailAndPassword' : 'google'
    },
    async submit(){
      this.$refs.accountPreferenceForm.validate()
      if(this.valid){ 
        this.loading = true
        try {
          await this.changeEmail()
          await this.changePassword()
          await this.uploadImageFile()
          await this.updateUser({
            name: this.name,
            phone: this.phone,
            profileImage: this.profileImage,
          })
          alert('Perfil atualizado com sucesso!')
        } catch(e) {
          alert('Desculpe ocorreu um erro ao tentar atualizar seu perfil!')
          console.log(e)
        } finally {
          this.loading = false
        }
      }
    },
    async changePassword(){
      if(this.password && this.passwordConfirmation) {
        await this.$fire.auth.currentUser.updatePassword(this.password)
      }
    },
    async changeEmail(){
      if(this.email && this.email !== this.$fire.auth.currentUser.email) {
        await this.$fire.auth.currentUser.verifyBeforeUpdateEmail(this.email)
        alert('enviamos um link de confirmação para este novo email')
      }
    },
    async uploadImageFile(){
      const uid = this.$fire.auth.currentUser.uid
      if(this.imageFile) {
        const path = `${uid}/profile`
        this.profileImage = await uploadImage(this.imageFile, path, this)
      }
    },
    async updateUser(params){
      const uid = this.$fire.auth.currentUser.uid
      await this.$fire.firestore.collection('users').doc(uid).update(params)
    },
    changeDarkTheme(value){
      if(value == false) {
        localStorage.removeItem('dark')
        this.$vuetify.theme.dark = false
      } else {
        localStorage.setItem('dark', 'yes')
        this.$vuetify.theme.dark = true
      }
    },
    async changeActiveNotifications(value){
      try {
        if(value) {
          const permission = await Notification.requestPermission()
          if(permission == 'granted') {
            const token = await this.$fire.messaging.getToken()
            await this.updateUser({ notificationToken: token })
          }
        } else {
          await this.updateUser({ notificationToken: "" })
        }
      } catch(e) {
        console.log("error on get token notification", e)
      }
    },
    markLocation(e){
      this.notificationAddress.lat = e.lat
      this.notificationAddress.lng = e.lng
      console.log(this.notificationAddress)
    },
    closeModal(){
      this.openModal = false
      this.updateUser({ notificationAddress: this.notificationAddress })
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
.profile-image {
  margin: 15px 0;
  width: 150px;
  border-radius: 50%;
}
.map-btn:hover {
  cursor: pointer;
}
</style>