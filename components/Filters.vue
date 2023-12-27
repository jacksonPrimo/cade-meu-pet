<template>
  <div class="filters">
    <div class="filter mb-3">
      <span class="filter-subtitle">
        Identificação
      </span>
      
      <div>
        <v-text-field
          outlined
          dense
          v-model="filters.name"
          label="Nome"
          class="my-2"
        ></v-text-field>

        <v-text-field
          outlined
          dense
          v-model="filters.chip"
          label="Chip Subcutaneo"
        ></v-text-field>
      </div>

    </div>

    <div class="filter">
      <span class="filter-subtitle">
        Endereço
      </span>
      
      <div>
        <div ref="map" class="map-containerr"></div>
        <v-subheader class="pl-0">
          Distancia máxima {{filters.distance}}km
        </v-subheader>
        <v-slider
          step="1"
          max="30"
          min="1"
          v-model="filters.distance"
          @change="changeRadius"
        ></v-slider>
      </div>

    </div>
    
    <div class="filter">
      <span class="filter-subtitle">
        Situação do pet
      </span>
      <div>
        <v-select
          multiple
          small-chips
          persistent-hint
          :items="situationOptions"
          v-model="filters.situation"
        ></v-select>
      </div>
    </div>

    <div class="filter">
      <span class="filter-subtitle">
        Espécie
      </span>
      <div>
        <v-select
          v-model="filters.race"
          :items="specieOptions"
          multiple
          persistent-hint
          small-chips
        ></v-select>
      </div>
    </div>

    <div class="filter mt-4">
      <span class="filter-subtitle">
        Gênero
      </span>
      <div>
      <v-select
        v-model="filters.gender"
        :items="genderOptions"
        multiple
        persistent-hint
        small-chips
      ></v-select>
      </div>
    </div>
    <div class="filter mt-4">
      <v-btn outlined color="primary" @click="filter">Filtrar</v-btn>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import { getLimitOfRange } from '@/utils/location'
import { situationOpt, specieOpt, genderOpt } from '@/static/postOptions'

export default {
  name: 'Filters',
  data: () => ({
    situationOptions: situationOpt(),
    specieOptions: specieOpt(),
    genderOptions: [
      {
        text: "Macho",
        value: "M"
      },
      {
        text: "Fêmea",
        value: "F"
      },
    ],
    filters: {
      name: '',
      chip: '',
      distance: 5,
      situation: [],
      race: [],
      gender: '',
      biggerThanLat: '',
      smallerThanLat: '',
      biggerThanLng: '',
      smallerThanLng: ''
    },
    circle: null,
    coords: null,
    marker: null
  }),
  mounted(){
    setTimeout(()=>this.initializeMap(), 500)
  },
  methods: {
    initializeMap() {
      this.map = L.map(this.$refs.map).setView([-12.256545945045046, -55.52556684608532], 4)
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
      this.map.addControl(searchControl)
      this.map.on('click', (e) => this.handleSelectedLocation({location: { y: e.latlng.lat, x: e.latlng.lng }}));
      this.map.on('geosearch/showlocation', this.handleSelectedLocation)
      document
        .querySelector('button.reset[aria-label="Clear search"]')
        .addEventListener('click', this.resetLocation)
    },
    handleSelectedLocation(e){
      this.coords = e
      const lat = e.location.y
      const lng = e.location.x
      const limits = getLimitOfRange(this.filters.distance, lat, lng)

      this.filters['biggerThanLat'] = limits.minLat
      this.filters['smallerThanLat'] = limits.maxLat
      this.filters['biggerThanLng'] = limits.minLng
      this.filters['smallerThanLng'] = limits.maxLng

      if(this.circle) {
        this.circle.setLatLng([lat, lng])
      } else {
        this.circle = L.circle([lat, lng], {
          color: 'green',
          fillColor: 'green',
          fillOpacity: 0.2,
          radius: this.filters.distance * 1000
        })
        this.circle.addTo(this.map);
      }

      if(!this.marker) {
        this.marker = e.marker
      } else {
        this.marker.setLatLng([lat, lng])
      }
    },
    resetLocation(){
      if(this.circle) {
        this.map.removeLayer(this.circle); 
        this.circle = null
      }
      this.filters['biggerThanLat'] = ''
      this.filters['smallerThanLat'] = ''
      this.filters['biggerThanLng'] = ''
      this.filters['smallerThanLng'] = ''
      this.marker = null
      this.map.setView([-12.256545945045046, -55.52556684608532], 4)
    },
    filter() {
      this.$emit('filter', this.filters)
    },
    changeRadius(){
      if (this.circle) {
        this.circle.setRadius(this.filters.distance * 1000)
      }
      if(this.coords) {
        this.handleSelectedLocation(this.coords)
      }
    }
  }
}
</script>

<style lang="scss">
.filters {
  .map-containerr {
    z-index: 1;
    height: 400px;
  }
  .filter-title {
    font-weight: bold;
    font-size: 24px;
  }
  
  .filter-subtitle {
    font-weight: 500;
    font-size: 18px;
  }
  
  .filter {
    .v-text-field__details, .v-messages {
      display: none;
    }
  }
}
</style>