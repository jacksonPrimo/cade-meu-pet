<template>
  <v-row>
    <v-col cols="6 first-column"></v-col>
    <v-col cols="6 second-column">
      <v-stepper v-model="currentStep" vertical>

        <basic-info :currentStep="currentStep" @next="next"></basic-info>

        <identify :currentStep="currentStep" @next="next" @previous="previous"></identify>

        <location :currentStep="currentStep" @next="finish" @previous="previous"></location>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import BasicInfo from '@/components/Steps/BasicInfo.vue'
import Identify from '@/components/Steps/Identify.vue'
import Location from '@/components/Steps/Location.vue'

export default {
  components: { BasicInfo, Identify, Location },
  name: 'CreatePost',
  layout: "authenticated",
  data: () => ({
    currentStep: 1,
  }),
  methods: {
    next(){
      this.currentStep += 1
    },
    previous(){
      this.currentStep -= 1
    },
    finish(){
      const params = this.$store.state.post.postToCreate 
      this.$fire.firestore.collection('posts').add(params)
    }
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