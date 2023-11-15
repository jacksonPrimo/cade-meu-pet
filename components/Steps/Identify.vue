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
        :rules="[ value => value ? true : 'Nome é obrigatório' ]"
        v-model="name"
        solo
      ></v-text-field>

      <v-textarea
        label="Descriçao"
        v-model="description"
        solo
        auto-grow
      ></v-textarea>

      <v-text-field
        label="Recompensa(Opcional)"
        v-model="reward"
        type="number"
        solo
      ></v-text-field>

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
   description: "",
   reward: ""
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
     // setar state
     if(this.valid) this.$emit("next")
   },
   previous(){
     this.$emit("previous")
   }
 }
}
</script>