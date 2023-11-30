<template>
  <v-row>
    <v-col sm="12" md="3" class="filterContainer">
      <filters @filter="filter"></filters>
    </v-col>
    <v-col sm="12" md="9">
      <v-row v-if="posts.length">
        <v-col sm="12" md="4" lg="3" v-for="(post, index) in posts" :key="index">
          <div @click="selectedPost = post">
            <PostCard :post="post"></PostCard>
          </div>
        </v-col>
      </v-row>
      <div v-else class="text-center mt-12 text-h3">
        <div>Desculpe não encontramos nenhum resultado</div>
        <v-icon x-large>mdi-emoticon-sad</v-icon>
      </div>
    </v-col>
    <PostModal :post="selectedPost" @closeModal="selectedPost=null"></PostModal>
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
    filters: {},
    posts: [],
    selectedPost: null
  }),
  mounted(){
    this.getPosts({})
  },
  methods: {
    filter(filters){
      this.filters = filters
      this.getPosts()
    },
    getPosts(){
      console.log("filters", this.filters)
      let query = this.$fire.firestore.collection('posts')
      if(this.filters.name) query = query.where('name', '==', this.filters.name)
      if(this.filters.chip) query = query.where('chip', '==', this.filters.chip)
      if(this.filters.zipcode) query = query.where('zipcode', '==', this.filters.zipcode)
      if(this.filters.gender) query = query.where('gender', '==', this.filters.gender)
      if(this.filters.race?.length) query = query.where('race', 'in', this.extractValues(this.filters.race))
      if(this.filters.situation?.length) query = query.where('situation', 'in', this.extractValues(this.filters.situation))

      const skip = this.page * this.limit
      if(this.filters.biggerThanLat) {
        query = query.where('address.lat', '>=', this.filters.biggerThanLat)
        query = query.where('address.lat', '<=', this.filters.smallerThanLat)
        query.get().then(result=>{
          const docs = result.docs.filter(doc=>{
            const data = doc.data()
            return data.address.lng >= this.filters.biggerThanLng && data.address.lng <= this.filters.smallerThanLng
          })
          const filtered = docs.map(doc=>({id: doc.id, ...doc.data()}))
          this.posts = filtered.splice(skip, this.limit)
        })
      } else {
        query.orderBy('created').startAt(skip).limit(this.limit)
        query.get().then(posts=>{
          this.posts = []
          posts.forEach(doc=>this.posts.push({id: doc.id, ...doc.data()}))
        })
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

@media only screen and (min-width: 960px) {
  .filterContainer {
    height: 100vh;
    overflow-y: scroll;
  }
}

</style>
