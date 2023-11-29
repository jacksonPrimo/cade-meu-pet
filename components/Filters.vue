<template>
  <div>
    <div class="filter-title">
      Filtros
    </div>

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
        <div ref="map" class="map-container"></div>
        <v-subheader class="pl-0">
          Distancia máxima {{filters.distance}}km
        </v-subheader>
        <v-slider
          step="10"
          max="50"
          v-model="filters.distance"
        ></v-slider>
      </div>

    </div>
    
    <div class="filter">
      <span class="filter-subtitle">
        Situação do pet
      </span>
      <div>
        <v-combobox
          multiple
          small-chips
          :items="situationOptions"
          v-model="filters.situation"
        ></v-combobox>
      </div>
    </div>

    <div class="filter">
      <span class="filter-subtitle">
        Espécie
      </span>
      <div>
        <v-combobox
          multiple
          small-chips
          :items="specieOptions"
          v-model="filters.race"
        ></v-combobox>
      </div>
    </div>

    <div class="filter mt-4">
      <span class="filter-subtitle">
        Gênero
      </span>
      <div>
        <v-radio-group v-model="filters.gender">
          <v-radio
            label="Macho"
            value="M"
          ></v-radio>

          <v-radio
            label="Fêmea"
            value="F"
          ></v-radio>
        </v-radio-group>
      </div>
    </div>

    <div class="filter mt-4">
      <span class="filter-subtitle">
        Ordenar por
      </span>
      <div>
        <v-radio-group v-model="filters.sort">
          <v-radio
            label="Atividade"
            value="created"
          ></v-radio>

          <v-radio
            disabled
            label="Distance"
            value="distance"
          ></v-radio>
        </v-radio-group>
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

export default {
  name: 'Filters',
  data: () => ({
    situationOptions: [
      {
        text: "Perdido",
        value: "lost"
      },
      {
        text: "Encontrado",
        value: "found"
      },
      {
        text: "Para adoção",
        value: "adoption"
      },
    ],
    specieOptions: [
      {
        text: "Cão",
        value: "dog"
      },
      {
        text: "Gato",
        value: "cat"
      },
      {
        text: "Coelho",
        value: "rabbit"
      },
      {
        text: "Passaro",
        value: "bird"
      },
      {
        text: "Outro",
        value: "other"
      },
    ],
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
      distance: 0,
      situation: [],
      race: [],
      sort: "created",
      gender: '',
      biggerThanLat: '',
      smallerThanLat: '',
      biggerThanLng: '',
      smallerThanLng: ''
    },
  }),
  mounted(){
    this.initializeMap()
  },
  methods: {
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
      this.map.addControl(searchControl)
      this.map.on('geosearch/showlocation', this.handleSelectedLocation)
    },
    handleSelectedLocation(e){
      const lat = e.location.y
      const lng = e.location.x
      const radius = 5;
      const latDegrees = radius / 111
      const lngDegrees = radius / (111 * Math.cos(lat * (Math.PI / 180)))

      this.filters['biggerThanLat'] = lat - latDegrees
      this.filters['smallerThanLat'] = lat + latDegrees

      this.filters['biggerThanLng'] = lng - lngDegrees
      this.filters['smallerThanLng'] = lng + lngDegrees
    },
    filter() {
      this.$emit('filter', this.filters)
    }
  }
}
</script>

<style lang="scss">
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
</style>