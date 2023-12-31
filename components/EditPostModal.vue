<template>
  <v-row justify="center">
    <v-dialog
      v-model="openModal"
      persistent
      max-width="650px"
      scrollable
      style="overflow-x: hidden;"
    >
      <v-card v-if="openModal">
        <v-card-title class="pt-12">
          <span class="text-h5 mr-auto">{{post.name}}</span>
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
          <v-img
            class="white--text align-end"
            :src="post.image"
          >
          </v-img>
          <v-file-input
            accept="image/*"
            label="Selecione uma imagem"
            v-model="imageFile"
            outlined
            class="mt-4"
          >
          </v-file-input>
          <v-card-title>
            Localização
          </v-card-title>
         
          <selectable-map @markLocation="markLocation" :initialLocation="[post.addressLat, post.addressLng]"></selectable-map>

          <v-form ref="editPostForm" v-model="validForm" class="mt-6">
            <v-text-field
              label="Endereço"
              v-model="post.addressLabel"
              :rules="[ value => value ? true : 'Endereço é obrigatório' ]"
              outlined
            ></v-text-field>
            
            <v-select
              :items="situationOpt"
              :rules="[ value => value ? true : 'Situação é obrigatório' ]"
              label="Situação"
              v-model="post.situation"
              outlined
            ></v-select>

            <v-select
              :items="specieOpt"
              :rules="[ value => value ? true : 'Espécie é obrigatório' ]"
              label="Espécie"
              v-model="post.race"
              outlined
            ></v-select>

            <v-select
              :items="genderOpt"
              :rules="[ value => value ? true : 'Gênero é obrigatório' ]"
              label="Gênero"
              v-model="post.gender"
              outlined
            ></v-select>

            <v-text-field
              v-if="post.situation == 'lost'"
              label="Recompensa(Opcional)"
              v-model="post.reward"
              type="number"
              outlined
            ></v-text-field>

            <v-text-field
              label="Nome"
              v-model="post.name"
              outlined
            ></v-text-field>

            <v-text-field
              label="Nª.Microchip"
              v-model="post.chip"
              outlined
            ></v-text-field>

            <v-textarea
              label="Descriçao"
              v-model="post.description"
              solo
              auto-grow
            ></v-textarea>

            <v-btn
              :disabled="waiting"
              color="primary"
              @click="update"
            >
              Atualizar
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { situationOpt, specieOpt, genderOpt } from '@/static/postOptions'
import SelectableMap from '@/components/selectableMap.vue'
import { uploadImage } from '@/utils/image'
import { getAuthData } from '@/utils/auth'

export default {
  components: {
    SelectableMap
  },
  props: {
    selectedPost: {
      type: Object,
      required: true,      
    },
  },
  data: () => ({
    waiting: false,
    validForm: false,
    situationOpt: situationOpt(),
    specieOpt: specieOpt(),
    genderOpt: genderOpt(),
    imageFile: null,
    post: {
      addressLabel: "",
      addressLat: "",
      addressLng: "",
      authorId: "",
      chip: "",
      description: "",
      gender: "",
      image: "",
      name: "",
      race: "",
      reward: "",
      situation: "",
    }
  }),
  mounted(){
    this.post = this.selectedPost
  },
  methods: {
    closeModal(){
      this.comments = []
      this.$emit('closeModal')
    },
    markLocation(location){
      if(location.label) this.post.addressLabel = location.label
      this.post.addressLat = location.lat
      this.post.addressLng = location.lng
    },
    async update(){
      this.$refs.editPostForm.validate()
      if(!this.validForm) return 
      if(this.imageFile) this.post.image = await this.uploadFile()
      this.waiting = true
      const response = await this.$axios.patch(`/post/${this.selectedPost.id}`, this.post)
      this.waiting = false
      if(response.status == 200) {
        this.$emit("updatedPost")
        alert('Publicação atualizada com sucesso')
      } else {
        const message = response.message || 'Ocorreu um problema ao atualizar sua publicação'
        alert(message)
      }
    },
    async uploadFile(){
      const { userId } = getAuthData()
      const path = `${userId}/${this.selectedPost.id}`
      const result = await uploadImage(this.imageFile, path, this)
      this.imageFile = null
      return result
    },
  },
  computed: {
    openModal(){
      return !!this.post
    },
  }
}
</script>

<style lang="scss">
</style>