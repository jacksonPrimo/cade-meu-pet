<template>
  <v-row>
    <v-col cols="6 first-column"></v-col>
    <v-col cols="6 second-column">
      <v-stepper v-model="currentStep" vertical>
        <basic-info :currentStep="currentStep" @next="next"></basic-info>
        <identify :currentStep="currentStep" @next="next" @previous="previous"></identify>
        <post-image :currentStep="currentStep" @next="next" @previous="previous"></post-image>
        <location :currentStep="currentStep" @next="finish" @previous="previous" :waiting="waiting"></location>
      </v-stepper>
    </v-col>
    <v-snackbar v-model="alert">
      {{ alertText }}

      <template>
        <v-btn text @click="alert = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
import BasicInfo from '@/components/Steps/BasicInfo.vue'
import Identify from '@/components/Steps/Identify.vue'
import Location from '@/components/Steps/Location.vue'
import PostImage from '@/components/Steps/PostImage.vue'
import { uploadImage, randomImageId} from '@/utils/image'

export default {
  components: { BasicInfo, Identify, Location, PostImage },
  name: 'CreatePost',
  layout: "authenticated",
  data: () => ({
    currentStep: 1,
    alert: false,
    alertText: '',
    waiting: false
  }),
  methods: {
    next(){
      this.currentStep += 1
    },
    previous(){
      this.currentStep -= 1
    },
    async finish(){
      try {
        this.waiting = true
        const params = {...this.$store.state.post.postToCreate}
        params.image = await this.uploadFile(params.image)
        params.created = new Date()
        params.userId = this.$fire.auth.currentUser.uid
        this.$fire.firestore.collection('posts').add(params)
        this.alertText = "Sua publicação foi cadastrada com sucesso!"
      } catch(e) {
        console.log(e)
        this.alertText = "Desculpe, ocorreu um erro ao tentar cadastrar sua publicação"
      } finally {
        this.waiting = false
        this.alert = true
      }
    },
    uploadFile(image){
      const path = `${this.$fire.auth.currentUser.uid}/${randomImageId()}`
      return uploadImage(image, path, this)
    },
  }
}
</script>

<style lang="scss">
  .first-column {
    height: 90vh;
    background-image: url("../static/images/found.jpg");
    /* Image by <a href="https://www.freepik.com/free-photo/small-dog-being-adorable-studio_15615918.htm#query=animais&position=19&from_view=search&track=sph&uuid=1e54d905-dad0-4749-99a1-774e48f5867e">Freepik</a> */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>