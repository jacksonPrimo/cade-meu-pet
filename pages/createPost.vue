<template>
  <div class="create-post">
    <Loading v-if="waiting"></Loading>
    <Alert :config="alertConfig" :open="showAlert" @agree="goToPost"></Alert>
    <div class="first-column"></div>
    <div class="second-column">
      <v-stepper v-model="currentStep" vertical>
        <basic-info :currentStep="currentStep" @next="next"></basic-info>
        <identify :currentStep="currentStep" @next="next" @previous="previous"></identify>
        <post-image :currentStep="currentStep" @next="next" @previous="previous"></post-image>
        <location :currentStep="currentStep" @next="finish" @previous="previous" :waiting="waiting"></location>
      </v-stepper>
    </div>
  </div>
</template>

<script>
import BasicInfo from '@/components/Steps/BasicInfo.vue'
import Identify from '@/components/Steps/Identify.vue'
import Location from '@/components/Steps/Location.vue'
import Alert from '@/components/alert.vue'
import PostImage from '@/components/Steps/PostImage.vue'
import { uploadImage, randomImageId } from '@/utils/image'
import { getAuthData } from '@/utils/auth'

export default {
  components: { BasicInfo, Identify, Location, PostImage, Alert },
  name: 'CreatePost',
  layout: "authenticated",
  data: () => ({
    currentStep: 1,
    waiting: false,
    alertConfig: {},
    showAlert: false,
    postId: ""
  }),
  methods: {
    next(){
      this.currentStep += 1
    },
    previous(){
      this.currentStep -= 1
    },
    async finish(){
      this.waiting = true
      const params = {...this.$store.state.post.postToCreate}
      params.image = await this.uploadFile(params.image)
      const response = await this.$axios.post('/post/create', params)
      if(response.status == 201) {
        this.$store.dispatch('post/setPostToCreate', {})
        this.alertConfig = {
          description: "Publicação cadastrada com sucesso!",
          persistent: true,
          success: true,
          agreeBtn: "Ir para publicação"
        }
        this.postId = response.data.id
      } else {
        this.alertConfig = {
          description: response.message || "Ocorreu um erro ao tentar cadastrar sua publicação",
          persistent: false,
          success: false
        }
      }
      this.waiting = false
      this.showAlert = true
    },
    uploadFile(image){
      const { userId } = getAuthData()
      const path = `${userId}/${randomImageId()}`
      return uploadImage(image, path, this)
    },
    goToPost(){
      this.$router.push(`/posts?postId=${this.postId}`)
    }
  }
}
</script>

<style lang="scss">
  .create-post {
    display: flex;
    .first-column {
      height: auto;
      width: 50%;
      background-image: url("../static/images/found.jpg");
      /* Image by <a href="https://www.freepik.com/free-photo/small-dog-being-adorable-studio_15615918.htm#query=animais&position=19&from_view=search&track=sph&uuid=1e54d905-dad0-4749-99a1-774e48f5867e">Freepik</a> */
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
    .second-column {
      width: 50%;
    }
  }

  @media only screen and (max-width: 700px) {
  .create-post {
    .first-column { 
      display: none;
    }
    .second-column {
      width: 100%;
    }
  }
}
</style>