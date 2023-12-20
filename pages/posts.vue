<template>
  <v-row>
    <v-col sm="12" md="3" class="filterContainer">
      <div class="mobile-filter">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Filtros
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <filters @filter="filter"></filters>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div class="desktop-filter">
        <filters @filter="filter"></filters>
      </div>
    </v-col>
    <v-col sm="12" md="9">
      <div  v-if="posts.length">
        <v-row>
          <v-col sm="12" md="4" lg="3" v-for="(post, index) in posts" :key="index">
            <div class="post" @click="selectedPostId = post.id">
              <PostCard :post="post"></PostCard>
            </div>
          </v-col>
        </v-row>

        <div class="text-center" v-if="total > 1">
          <v-pagination
            v-model="page"
            :length="total"
          ></v-pagination>
        </div>
      </div>
      <div v-else class="text-center mt-12 text-h3">
        <div>Desculpe não encontramos nenhum resultado</div>
        <v-icon x-large>mdi-emoticon-sad</v-icon>
      </div>
    </v-col>

    <PostModal v-if="selectedPostId" :postId="selectedPostId" @closeModal="selectedPostId=null"></PostModal>
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
    page: 1,
    limit: 12,
    total: 0,
    posts: [],
    lastFilters: {},
    selectedPostId: null
  }),
  watch: {
    page: {
      handler () {
        this.getPosts()
      },
      deep: true,
    },
  },
  async mounted(){
    const postId = this.$route.query.postId
    if(postId) this.selectedPostId = postId
    this.getPosts()
  },
  methods: {
    filter(filters){
      this.lastFilters = filters
      this.getPosts()
    },
    async getPosts(){
      const params = new URLSearchParams(this.lastFilters)
      try {
        const response = await this.$axios.get(`/post/list?page=${this.page}&limit=${this.limit}&${params}`)
        this.posts = response.data.posts
        this.total = response.data.total
      } catch(e) {
        console.log(e)
        alert('Ocorreu um erro ao listar as publicações')
      }
    },
  }
}
</script>

<style lang="scss">
.desktop-filter {
  display: block;
}

.mobile-filter {
  display: none;
}

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

@media only screen and (max-width: 960px) {
  .desktop-filter {
    display: none;
  }

  .mobile-filter {
    display: block;
  }
}

</style>
