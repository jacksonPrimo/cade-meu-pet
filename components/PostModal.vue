<template>
  <v-row justify="center">
    <v-dialog
      v-model="openModal"
      persistent
      max-width="600px"
      scrollable
      style="overflow-x: hidden;"
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
        <v-card-text>
          <v-img
            class="white--text align-end"
            height="500px"
            :src="post.image"
          >
          </v-img>
          <v-card-title>
            Localização
          </v-card-title>
          <div id="map-wrap" style="height: 50vh;">
            <client-only>
              <l-map :zoom=13 :center="[post.addressLat, post.addressLng]">
                <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
                <l-marker :lat-lng="[post.addressLat, post.addressLng]"></l-marker>
              </l-map>
            </client-only>
          </div>
          <v-card-title>Comentarios</v-card-title>
          <div class="pl-2 pr-2">
            <v-textarea
              solo
              auto-grow
              name="input-7-4"
              label="Deixe um comentário"
              v-model="comment"
              :disabled="writing"
              @keydown.enter="writeAComment"
            ></v-textarea>
          </div>
          <div class="ml-2 mb-2">
            <v-chip class="pt-7 pb-7 my-2 mr-2" v-for="(comment, index) of comments" :key="index" style="text-wrap: wrap; min-width: 98%;">
              <v-avatar left  size="56">
                <v-img :src="comment.author.profileImage"></v-img>
              </v-avatar>
              <div>
                {{ comment.description }}                
              </div>
            </v-chip>
          </div>
        </v-card-text>
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
  data: () => ({
    comment: "",
    writing: false,
    comments: [],
    page: 0
  }),
  mounted(){
    this.getComments()
  },
  methods: {
    closeModal(){
      this.comments = []
      this.$emit('closeModal')
    },
    async getComments(){
      try {
        const response = await this.$axios.get(`comment/list?page=${this.page}&postId=${this.post.id}`)
        this.comments = response.data
      } catch(e) {
        alert(e.response.data.message)
      }
    },
    async writeAComment(e){
      if(!this.comment) return
      e.preventDefault()
      const params = {
        description: this.comment,
        postId: this.post.id,
      }
      this.writing = true
      try {
        const response = await this.$axios.post('comment/create', params)
        this.comments = response.data
      } catch(e) {
        alert(e.response.data.message)
      }
      this.writing = false
    }
  },
  computed: {
    openModal(){
      return !!this.post
    },
  }
}
</script>

<style lang="scss">
</style>