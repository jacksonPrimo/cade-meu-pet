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
  mounted() {
    setTimeout(()=>this.initializeMap(), 500)
  },
  methods: {
    initializeMap(){
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
      this.map.on('geosearch/showlocation', this.changedSearch)
      this.map.on('click', (e) => this.markLocation({ lat: e.latlng.lat, lng: e.latlng.lng }));
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