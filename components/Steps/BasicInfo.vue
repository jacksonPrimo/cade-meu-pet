<template>
   <div>
    <v-stepper-step
      :complete="currentStep > step"
      :step="step"
    >
      Informações Básicas
    </v-stepper-step>
  
    <v-stepper-content :step="step">
      <v-form ref="basicInfoForm" v-model="valid">
        <v-select
          :items="situationOptions"
          :rules="[ value => value ? true : 'Situação é obrigatório' ]"
          label="Situação"
          v-model="situation"
          solo
        ></v-select>
        <v-select
          :items="specieOptions"
          :rules="[ value => value ? true : 'Espécie é obrigatório' ]"
          label="Espécie"
          v-model="race"
          solo
        ></v-select>
        <v-select
          :items="genderOptions"
          :rules="[ value => value ? true : 'Gênero é obrigatório' ]"
          label="Gênero"
          v-model="gender"
          solo
        ></v-select>
        <v-text-field
          v-if="situation == 'lost'"
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
      </v-form>
    </v-stepper-content>
  </div>
</template>
<script>
import { situationOpt, specieOpt, genderOpt } from '@/static/postOptions'
export default {
  name: 'BasicInfo',
  data: () => ({
    step: 1,
    valid: false,
    situationOptions: situationOpt(),
    specieOptions: specieOpt(),
    genderOptions: genderOpt(),
    situation: "",
    race: "",
    gender: "",
    reward: null
  }),
  props: {
    currentStep: {
      type: Number,
      required: true
    }
  },
  methods: {
    next(){
      this.$refs.basicInfoForm.validate()
      if(this.valid) {
        this.$store.dispatch('post/setPostToCreate', {
          situation: this.situation,
          race: this.race,
          gender: this.gender,
          reward: this.reward ? +this.reward : null
        })
        this.$emit("next")
      }
    }
  }
}
</script>