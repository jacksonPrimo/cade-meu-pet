<template>
  <div ref="map" class="map-container"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'

export default {
  name: 'SelectableMap',
  data: () => ({
    map: null,
    marker: null,
    location: null,
  }),
  props: {
    initialLocation: {
      type: Array,
      required: false
    },
    canEdit: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  mounted() {
    setTimeout(()=>this.initializeMap(), 500)
  },
  methods: {
    initializeMap(){
      const location = this.initialLocation || [-12.256545945045046, -55.52556684608532]
      const zoom = this.initialLocation ? 18 : 4
      this.map = L.map(this.$refs.map).setView(location, zoom)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map)
      if(this.canEdit) this.addSearchControl()
      if(this.canEdit) {
        this.map.on('click', (e) => this.markLocation({ lat: e.latlng.lat, lng: e.latlng.lng }));
      }
      if(this.initialLocation) {
       this.markLocation({lat: this.initialLocation[0], lng: this.initialLocation[1]})
      }
    },

    addSearchControl(){
      const provider = new OpenStreetMapProvider()
      const searchControl = new GeoSearchControl({
        provider,
        style: 'bar',
        autoComplete: true,
        autoClose: true,
        keepResult: true,
      })
      this.map.addControl(searchControl)
      this.map.on('geosearch/showlocation', this.changedSearch)
    },
    changedSearch(e){
      this.map.removeLayer(e.marker);
      this.markLocation({ lat: e.location.y, lng: e.location.x, label: e.location.label })
    },
    markLocation(e){
      if(!this.marker) {
        this.marker = L.marker([e.lat, e.lng])
        this.marker.addTo(this.map);
      } else {
        this.marker.setLatLng([e.lat, e.lng])
      }
      this.$emit('markLocation', e)
    }
  }
}
</script>

<style>
.map-container {
  height: 400px;
}
</style>