<template>
  <div class="posts-page">
    <div class="filter-column">
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
    </div>
    <div class="posts-column">
      <div v-if="loading" class="posts-container">
        <div class="post" v-for="(load, index) in 4" :key="index">
          <v-skeleton-loader
            class="mx-auto"
            type="card"
          ></v-skeleton-loader>
        </div>
      </div>
      <div v-else>
        <div v-if="posts.length">
          <div class="posts-container">
            <div 
              v-for="(post, index) in posts" 
              :key="index"
              class="post" 
              @click="selectedPostId = post.id"
            >
              <PostCard :post="post"></PostCard>
            </div>
          </div>
  
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
      </div>
    </div>
    <PostModal v-if="selectedPostId" :postId="selectedPostId" @closeModal="selectedPostId=null"></PostModal>
  </div>
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
    loading: true,
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
      this.loading = true
      const response = await this.$axios.get(`/post/list?page=${this.page}&limit=${this.limit}&${params}`)
      this.loading = false
      if(response.status == 200) {
        this.posts = response.data.posts
        this.total = response.data.total
      } else {
        const message = response.message || 'Ocorreu um erro ao listar as publicações'
        alert(message)
      }
    },
  }
}
</script>

<style lang="scss">
.posts-page {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .filter-column {
    width: 28%;
    height: 83vh;
    padding-right: 3px;
    padding-bottom: 10px;
    overflow-y: scroll;
    overflow-x: hidden;
    .desktop-filter {
      display: block;
    }
    .mobile-filter {
      display: none;
    }
  }
  .posts-column {
    width: 72%;
    .posts-container {
      margin-left: auto;
      margin-right: auto;
      display: flex;
      flex-direction: row;
      justify-content: baseline;
      flex-wrap: wrap;
      .post {
        width: 33%;
        padding: 8px 5px;
      }
      .post:hover {
        cursor: pointer;
      }
    }
  }
}

::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: transparent; 
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

@media only screen and (min-width: 1400px) {
  .posts-page {
    .posts-column {
      .posts-container {
        .post {
          width: 25%;
        }
      }
    }
  }
}
@media only screen and (max-width: 960px) {
  .posts-page {
    .filter-column {
      width: 100%;
      height: auto;
      overflow-y: hidden;
      .desktop-filter {
        display: none;
      }
      .mobile-filter {
        margin-bottom: 10px;
        display: block;
      }
    }
    .posts-column {
      width: 100%;
    }
  }
}

@media only screen and (max-width: 800px) {
  .posts-page {
    .posts-column {
      .posts-container {
        .post {
          width: 48%;
        }
      }
    }
  }
}
@media only screen and (max-width: 500px) {
  .posts-page {
    .posts-column {
      .posts-container {
        .post {
          width: 98%;
        }
      }
    }
  }
}

</style>
