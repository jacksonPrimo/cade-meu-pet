<template>
  <v-row>
    <v-col sm="12" md="3" class="filterContainer">
      <filters @filter="filter"></filters>
    </v-col>
    <v-col sm="12" md="9">
      <v-row v-if="posts.length">
        <v-col sm="12" md="4" lg="3" v-for="(post, index) in posts" :key="index">
          <div class="post" @click="selectedPost = post">
            <PostCard :post="post"></PostCard>
          </div>
        </v-col>
      </v-row>
      <div v-else class="text-center mt-12 text-h3">
        <div>Desculpe não encontramos nenhum resultado</div>
        <v-icon x-large>mdi-emoticon-sad</v-icon>
      </div>
    </v-col>
    <PostModal v-if="selectedPost" :post="selectedPost" @closeModal="selectedPost=null"></PostModal>
  </v-row>
</template>

<script>
import PostCard from '@/components/Card.vue'
import PostModal from '@/components/PostModal.vue'
import Filters from '@/components/Filters.vue'

export default {
  name: 'LostAndFoundPage',
  layout: "authenticated",
  components: {
    PostCard,
    PostModal,
    Filters
  },
  data: ()=>({
    page: 0,
    limit: 16,
    posts: [],
    selectedPost: null
  }),
  mounted(){
    this.getPosts({})
  },
  methods: {
    filter(filters){
      this.getPosts(filters)
    },
    async getPosts(filters){
      const params = new URLSearchParams(filters)
      try {
        const response = await this.$axios.get(`/post/list?${params}`)
        this.posts = response.data
      } catch(e) {
        alert('Ocorreu um erro ao listar as publicações')
      }
    },
    extractValues(selecteds){
      return selecteds.map(s => s.value)
    }
  }
}
</script>

<style lang="scss">
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
::-webkit-scrollbar-thumb {
  background: #888; 
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
::-webkit-scrollbar-button {
  height: 5px;
}
.postContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.post:hover {
  cursor: pointer;
}

@media only screen and (min-width: 960px) {
  .filterContainer {
    height: 100vh;
    overflow-y: scroll;
  }
}

</style>
