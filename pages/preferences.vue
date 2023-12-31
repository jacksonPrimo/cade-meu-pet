<template>
  <div class="preferences">
    <div class="first-column">
      <img src="images/preferences.svg">
      <!-- <a href="https://br.freepik.com/vetores-gratis/ilustracao-do-conceito-de-processamento_7126211.htm#query=config&position=9&from_view=search&track=sph&uuid=69198325-e013-401a-8c54-941a64a8a532">Imagem de storyset</a> no Freepik -->
    </div>
    <div class="second-column">
      <v-form ref="accountPreferenceForm" v-model="valid" :disabled="loading">
        <div class="profile-image-container">
          <div class="profile-image">
            <img :src="profileImage ? profileImage : 'images/profile.svg'" alt="Imagem" />
            <!-- <a href="https://br.freepik.com/vetores-gratis/ilustracao-do-conceito-de-processamento_7126211.htm#query=config&position=9&from_view=search&track=sph&uuid=69198325-e013-401a-8c54-941a64a8a532">Imagem de storyset</a> no Freepik -->
            <div class="actions">
              <v-btn color="red" :disabled="loadingRemoveImage" v-if="profileImage" @click="removeImage">
                <v-icon
                  color="white"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-trash-can
                </v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <v-file-input
          solo
          prepend-icon=""
          prepend-inner-icon="mdi-camera"
          accept="image/*"
          label="Escolha uma imagem"
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
        :disabled="loading"
        v-model="darkTheme"
        label="Tema escuro"
        @change="changeDarkTheme"
      ></v-switch>
      <div style="display: flex;">
        <v-switch
          :disabled="loading"
          v-model="notification"
          label="Ativar notificações"
          @change="changeActiveNotifications"
        ></v-switch>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="ml-2"
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              mdi-information-slab-circle-outline
            </v-icon>
          </template>
          <span>
            Se ativo você receberá notificações por email sempre que houver uma nova
            publicação cadastrada na região escolhida na opção abaixo
          </span>
        </v-tooltip>
      </div>

      <v-btn :disabled="loading" v-if="notification" outlined color="blue darken-2" @click="openModal = true">
        <v-icon color="blue darken-2">mdi-map</v-icon>
        Endereço de notificação
      </v-btn>

      <v-dialog
        v-model="openModal"
        persistent
        max-width="650px"
      >
        <v-card>
          <v-card-title class="pt-12">
            <span class="text-h5 mr-auto">Endereço</span>
            <v-btn
              color="blue darken-1"
              text
              @click="closeModal(false)"
            >
              <v-icon dark>
                mdi-close
              </v-icon>
            </v-btn> 
          </v-card-title>
          <v-card-text>
            <selectable-map @markLocation="markLocation" :initialLocation="initialLocation()"></selectable-map>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="closeModal(true)"
            >
              Salvar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
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
    loadingRemoveImage: false,
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
    const response = await this.$axios.get('user/me')
    this.loading = false
    if(response.status == 200) {
      this.email = response.data.email || ''
      this.name = response.data.name || ''
      this.phone = response.data.phone || ''
      this.profileImage = response.data.profileImage || ''
      this.notification = response.data.notification
      this.notificationLat = response.data.notificationLat    
      this.notificationLng = response.data.notificationLng    
      this.loading = false
    } else {
      alert(response.message || "Ocorreu um erro ao recuperar seus dados")
    }
  },
  methods: {
    async submit(){
      this.$refs.accountPreferenceForm.validate()
      if(this.valid){ 
        this.loading = true
        await this.uploadImageFile()
        const response = await this.$axios.patch('user', {
          email: this.email,
          name: this.name,
          phone: this.phone,
          profileImage: this.profileImage,
          password: this.password,
        })
        if(response.status == 200) {
          alert('Perfil atualizado com sucesso!')
        } else {
          alert(response.message || "Ocorreu um erro ao atualizar seus dados")
        }
        this.loading = false
      }
    },
    async uploadImageFile(){
      if(this.imageFile) {
        const path = `${this.userId}/profile`
        this.profileImage = await uploadImage(this.imageFile, path, this)
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
      await this.$axios.patch('user', { notification: value })
    },
    markLocation(e){
      this.notificationLat = e.lat
      this.notificationLng = e.lng
    },
    closeModal(changed){
      this.openModal = false
      if(changed) {
        this.$axios.patch('user', {
          notificationLat: this.notificationLat,
          notificationLng: this.notificationLng 
        })
      }
    },

    initialLocation(){
      if(this.notificationLat && this.notificationLng) {
        return [this.notificationLat, this.notificationLng]
      } else {
        return null
      }
    },

    async removeImage(){
      this.loadingRemoveImage = true
      const response = await this.$axios.patch('user', {
        profileImage: ""
      })
      if(response.status !== 200) {
        alert(response.message || "Ocorreu um erro ao remover sua foto de perfil")
      } else {
        this.profileImage = ""
      }
      this.loadingRemoveImage = false
    }
  }
}
</script>

<style lang="scss" scoped>
.preferences {
  display: flex;
  .first-column, .second-column {
    width: 50%;
  }
}
.profile-image-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-image {
  position: relative;
  width: 150px; /* Defina a largura desejada para a imagem */
  height: 150px; /* Defina a altura desejada para a imagem */
  border-radius: 50%; /* Define a borda como circular */
  overflow: hidden; /* Oculta partes da imagem fora do círculo */
  margin-bottom: 10px
}

.profile-image img {
  width: 100%; /* Garante que a imagem preencha o espaço do container */
  height: auto; /* Mantém a proporção original da imagem */
  display: block; /* Remove espaços indesejados */
}

.profile-image .actions {
  text-align: center;
  margin-top: -30px;
  button {
    width: 100%;
  }
}

.map-btn:hover {
  cursor: pointer;
}

@media only screen and (max-width: 700px) {
  .preferences {
    .first-column { 
      display: none;
    }
    .second-column {
      width: 100%;
    }
  }
}
</style>