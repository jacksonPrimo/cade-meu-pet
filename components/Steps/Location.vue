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
      <v-btn color="primary" @click="next">
        Continue
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
    step: 3,
    map: null,
    location: null
  }),
  props: {
    currentStep: {
      type: Number,
      required: true
    }
  },
  mounted() {
    this.initializeMap()
  },
  methods: {
    next(){
      if(this.location){
        this.$store.dispatch('post/setPostToCreate', {
          addressLabel: this.location.label,
          addressLong: this.location.x, 
          addressLat: this.location.y
        })
        this.$emit("next")
      } else {
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
        keepResult: true
      })
      this.map.on('geosearch/showlocation', this.handleSelectedLocation)
      this.map.addControl(searchControl)
    },
    handleSelectedLocation(e){
      this.location = e.location
    }
  }
}
</script>

<style>
.map-container {
  height: 400px;
}
</style>
