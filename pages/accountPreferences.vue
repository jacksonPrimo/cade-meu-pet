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
        v-model="notification"
        label="Ativar notificações"
        @change="changeActiveNotifications"
      ></v-switch>

      <v-btn v-if="notification" outlined color="blue darken-2" @click="openModal = true">
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
            <selectable-map @markLocation="markLocation" :initialLocation="[this.notificationLat, this.notificationLng]"></selectable-map>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import { uploadImage } from '@/utils/image'
import SelectableMap from '@/components/selectableMap.vue'
import { getAuthData } from '@/utils/auth'

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
    showPassword: false,
    showConfirmPassword: false,
    darkTheme: false,
    userId: '',
    imageFile: null,
    name: '',
    phone: '',
    email: '',
    profileImage: '',
    notification: false,
    notificationLat: '',
    notificationLng: '',
    password: '',
    passwordConfirmation: '',
  }),
  async mounted(){
    this.darkTheme = !!localStorage.getItem('dark')
    this.userId = getAuthData().userId
    this.loading = true
    try {
      const response = await this.$axios.get('user/me')
      this.email = response.data.email || ''
      this.name = response.data.name || ''
      this.phone = response.data.phone || ''
      this.profileImage = response.data.profileImage || ''
      this.notification = response.data.notification
      this.notificationLat = response.data.notificationLat    
      this.notificationLng = response.data.notificationLng    
    } catch(e) {
      alert(e.response.data.message)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async submit(){
      this.$refs.accountPreferenceForm.validate()
      if(this.valid){ 
        this.loading = true
        await this.uploadImageFile()
        await this.updateUser({
          email: this.email,
          name: this.name,
          phone: this.phone,
          profileImage: this.profileImage,
          password: this.password,
        })
        this.loading = false
      }
    },
    async uploadImageFile(){
      if(this.imageFile) {
        const path = `${this.userId}/profile`
        this.profileImage = await uploadImage(this.imageFile, path, this)
      }
    },
    async updateUser(params, doAlert=true){
      try {
        await this.$axios.patch('user', params)
        if(doAlert) alert('Perfil atualizado com sucesso!')
      } catch(e) {
        alert(e.response.data.message)
      }
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
      await this.updateUser({ notification: value }, false)
    },
    markLocation(e){
      this.notificationLat = e.lat
      this.notificationLng = e.lng
    },
    closeModal(){
      this.openModal = false
      this.updateUser({ 
        notificationLat: this.notificationLat,
        notificationLng: this.notificationLng 
      }, false)
    },
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