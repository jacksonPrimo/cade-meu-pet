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
          label="Cidade"
          v-model="address.city"
          :rules="[ value => value ? true : 'Cidade é obrigatório' ]"
          outlined
          dense
        ></v-text-field>

        <v-text-field
          label="Bairro"
          v-model="address.district"
          :rules="[ value => value ? true : 'Bairro é obrigatório' ]"
          outlined
          dense
        ></v-text-field>
        
        <v-text-field
        label="Rua"
        v-model="address.street"
        :rules="[ value => value ? true : 'Rua é obrigatório' ]"
        outlined
        dense
        ></v-text-field>

        <v-text-field
          label="Cep"
          v-model="address.zipcode"
          :rules="[ value => value ? true : 'Cep é obrigatório' ]"
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
    address: {
      state: '',
      district: '',
      city: '',
      street: '',
      zipcode: '',
      lat: '',
      lng: ''
    }
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
      if(this.formValid && this.address.lat && this.address.lng) {
        this.$store.dispatch('post/setPostToCreate', {
          address: this.address
        })
        this.$emit("next")
      } else if(!this.address.lat || !this.address.lng){
        alert('selecione uma localização')
      }
    },
    previous(){
      this.$emit("previous")
    },
    markLocation(e){
      this.address.lat = e.lat
      this.address.lng = e.lng
      if(e.label) this.populateFormAddressValues(e.label)
    },
    populateFormAddressValues(label){
      const splittedInfo = label.split(',')
      if(splittedInfo.length == 8) {
        this.address.state = splittedInfo[4]
        this.address.district = splittedInfo[0]
        this.address.city = splittedInfo[1]
        this.address.zipcode = splittedInfo[6]
      } else if(splittedInfo.length == 6) {
        this.address.street = splittedInfo[0]
        this.address.state = splittedInfo[3]
        this.address.city = splittedInfo[1]
      } else if(splittedInfo.length == 9) {
        this.address.street = splittedInfo[0]
        this.address.district = splittedInfo[1]
        this.address.city = splittedInfo[2]
        this.address.state = splittedInfo[5]
        this.address.zipcode = splittedInfo[7]
      }
    }
  }
}
</script>

<style>
.map-container {
  height: 400px;
}
</style>
