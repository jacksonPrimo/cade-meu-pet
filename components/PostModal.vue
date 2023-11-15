<template>
  <v-row justify="center">
    <v-dialog
      v-model="openModal"
      persistent
      max-width="600px"
      scrollable
    >
      <v-card v-if="openModal">
        <v-card-title>
          <span class="text-h5 mr-auto">{{post.name}}</span>
          <v-btn
            color="blue darken-1"
            text
            @click="closeModal"
          >
            <v-icon dark>
              mdi-close
            </v-icon>
          </v-btn> 
        </v-card-title>
        <v-card-section>
          <v-img
            class="white--text align-end"
            height="500px"
            :src="post.image"
          >
          </v-img>
        </v-card-section>
        <v-card-section>
        </v-card-section>
        <v-card-section>
          <v-card-title>
            Localização
          </v-card-title>
          <div id="map-wrap" style="height: 50vh;">
            <client-only>
              <l-map :zoom=13 :center="[-7.080158, -41.414843]">
                <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
                <l-marker :lat-lng="[-7.080158, -41.414843]"></l-marker>
              </l-map>
            </client-only>
          </div>
        </v-card-section>
        <v-card-section style="background-color: white;">
          <v-card-title>Comentarios</v-card-title>
          <div class="pl-2 pr-2">
            <v-textarea
              solo
              auto-grow
              name="input-7-4"
              label="Deixe um comentário"
            ></v-textarea>
          </div>
          <div class="ml-2 mb-2">
            <v-chip class="pt-7 pb-7">
              <v-avatar left  size="56">
                <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
              </v-avatar>
              <div>
                John Leider John Leider John Leider John Leider John Leider John Leider John Leider <br>
                John Leider John Leider John Leider John Leider John Leider John Leider
              </div>
            </v-chip>
          </div>
        </v-card-section>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    props: {
      post: {
        type: Object,
        required: false,
      },
    },
    methods: {
      closeModal(){
        this.$emit('closeModal')
      }
    },
    computed: {
      openModal(){
        return !!this.post
      }
    }
  }
</script>

<style lang="scss">
</style>