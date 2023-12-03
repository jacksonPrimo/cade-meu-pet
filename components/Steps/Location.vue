<template>
  <div>
    <v-stepper-step
      :complete="currentStep > step"
      :step="step"
    >
      Localização
    </v-stepper-step>
  
    <v-stepper-content :step="step">
      <div ref="map" class="map-container"></div>
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
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'

export default {
  name: 'Location',
  data: () => ({
    step: 4,
    map: null,
    marker: null,
    location: null,
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
  mounted() {
    this.initializeMap()
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
    initializeMap() {
      this.map = L.map(this.$refs.map).setView([-7.080158, -41.414843], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map)
      const provider = new OpenStreetMapProvider()
      const searchControl = new GeoSearchControl({
        provider,
        style: 'bar',
        autoComplete: true,
        autoClose: true,
        keepResult: true,
      })
      this.map.on('geosearch/showlocation', this.handleSelectedLocation)
      this.map.addControl(searchControl)
      this.map.on('click', (e) => this.selectPosition(e.latlng.lat, e.latlng.lng));
    },
    handleSelectedLocation(e){
      this.map.removeLayer(e.marker);
      this.selectPosition(e.location.y, e.location.x)
      const splittedInfo = e.location.label.split(',')
      if(splittedInfo.length == 8) {
        this.address = {
          street: "",
          state: splittedInfo[4],
          district: splittedInfo[0],
          city: splittedInfo[1],
          zipcode: splittedInfo[6],
          lat: e.y,
          lng: e.x,
        }
      } else if(splittedInfo.length == 6) {
        this.address = {
          street: splittedInfo[0],
          state: splittedInfo[3],
          district: "",
          city: splittedInfo[1],
          zipcode: "",
          lat: e.y,
          lng: e.x,
        }
      } else if(splittedInfo.length == 9) {
        this.address = {
          street: splittedInfo[0],
          district: splittedInfo[1],
          city: splittedInfo[2],
          state: splittedInfo[5],
          zipcode: splittedInfo[7],
          lat: e.y,
          lng: e.x,
        }
      } else {
        this.address['lat'] = e.y
        this.address['lng'] = e.x
      }
    },
    selectPosition(lat, lng){
      this.address['lat'] = lat
      this.address['lng'] = lng
      if(!this.marker) {
        this.marker = L.marker([lat, lng])
        this.marker.addTo(this.map);
      } else {
        this.marker.setLatLng([lat, lng])
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
