<template>
  <div>
    <v-stepper-step
      :complete="currentStep > step"
      :step="step"
    >
      Localização
    </v-stepper-step>
  
    <v-stepper-content :step="step">
      <selectable-map @markLocation="markLocation"></selectable-map>
      <v-form ref="addressForm" v-model="formValid" class="mt-4">
        <v-text-field
          label="Endereço"
          v-model="addressLabel"
          :rules="[ value => value ? true : 'Digite um endereço' ]"
          outlined
          dense
        ></v-text-field>
      </v-form>
      <v-btn :disabled="waiting" color="primary" @click="next">
        Finalizar
      </v-btn>
      
      <v-btn @click="previous">
        Voltar
      </v-btn>
    </v-stepper-content>
  </div>
</template>

<script>
import selectableMap from '@/components/selectableMap.vue'

export default {
  name: 'Location',
  components: {
    selectableMap
  },
  data: () => ({
    step: 4,
    formValid: false,
    addressLat: '',
    addressLng: '',
    addressLabel: '',
  }),
  props: {
    currentStep: {
      type: Number,
      required: true
    },
    waiting: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    next(){
      this.$refs.addressForm.validate()
      if(this.formValid && this.addressLat && this.addressLng) {
        this.$store.dispatch('post/setPostToCreate', {
          addressLabel: this.addressLabel,
          addressLat: this.addressLat,
          addressLng: this.addressLng
        })
        this.$emit("next")
      } else if(!this.addressLat || !this.addressLng){
        alert('selecione uma localização')
      }
    },
    previous(){
      this.$emit("previous")
    },
    markLocation(e){
      this.addressLat = e.lat
      this.addressLng = e.lng
      if(e.label) this.addressLabel = e.label
    },
  }
}
</script>

<style>
.map-container {
  height: 400px;
}
</style>
