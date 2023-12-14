<template>
  <div>
   <v-stepper-step
     :complete="currentStep > step"
     :step="step"
   >
     Identificação
   </v-stepper-step>
 
   <v-stepper-content :step="step">
    <v-form ref="identifyForm" v-model="valid">
      <v-text-field
        label="Nome"
        v-model="name"
        solo
      ></v-text-field>

      <v-text-field
        label="Nª.Microchip"
        v-model="chip"
        solo
      ></v-text-field>

      <v-textarea
        label="Descriçao"
        v-model="description"
        solo
        auto-grow
      ></v-textarea>

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
    </v-form>
   </v-stepper-content>
 </div>
</template>
<script>
export default {
 name: 'Identify',
 data: () => ({
   step: 2,
   valid: false,
   name: "",
   chip: "",
   description: "",
 }),
 props: {
   currentStep: {
     type: Number,
     required: true
   }
 },
 methods: {
   next(){
     this.$refs.identifyForm.validate()
     if(this.valid){
      this.$store.dispatch('post/setPostToCreate', {
        name: this.name,
        description: this.description,
        chip: this.chip,
      })
      this.$emit("next")
     }
   },
   previous(){
     this.$emit("previous")
   }
 },
 computed: {
  isLost(){
    return this.$store.state.post.postToCreate.situation == 'lost'
  }
 }
}
</script>