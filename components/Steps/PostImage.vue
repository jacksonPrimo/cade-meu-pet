<template>
  <div>
   <v-stepper-step
     :complete="currentStep > step"
     :step="step"
   >
     Imagem
   </v-stepper-step>
 
   <v-stepper-content :step="step">
    <v-file-input
      accept="image/*"
      label="Selecione uma imagem"
      v-model="image"
    ></v-file-input>
    <v-btn
      color="primary"
      @click="next"
    >
      Continue
    </v-btn>
    <v-btn
      @click="previous"
    >
      Voltar
    </v-btn>
   </v-stepper-content>
 </div>
</template>
<script>
export default {
 name: 'PostImage',
 data: () => ({
   step: 3,
   image: null
 }),
 props: {
   currentStep: {
     type: Number,
     required: true
   }
 },
 methods: {
   next(){
     if(this.image){
      this.$store.dispatch('post/setPostToCreate', {
        image: this.image
      })
      this.$emit("next")
     }
   },
   previous(){
     this.$emit("previous")
   }
 }
}
</script>