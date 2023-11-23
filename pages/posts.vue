<template>
  <v-row>
    <v-col sm="12" md="3">
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
            v-model="name"
            label="Nome"
          ></v-text-field>

          <v-text-field
            outlined
            dense
            v-model="chipId"
            label="Chip Subcutaneo"
          ></v-text-field>
        </div>

      </div>

      <div class="filter">
        <span class="filter-subtitle">
          Endereço
        </span>
        
        <div>
          <v-text-field
            outlined
            dense
            v-model="zipcode"
            label="Cep"
          ></v-text-field>
          <v-subheader class="pl-0">
            Distancia máxima {{zipcodeDistance}}km
          </v-subheader>
          <v-slider
            step="10"
            max="50"
            v-model="zipcodeDistance"
          ></v-slider>
        </div>

      </div>
      
      <div class="filter">
        <span class="filter-subtitle">
          Situação do pet
        </span>
        <div>
          <v-switch
            v-model="found"
            label="Perdido"
          ></v-switch>
          <v-switch
            v-model="lost"
            label="Encontrado"
          ></v-switch>
        </div>
      </div>

      <div class="filter">
        <span class="filter-subtitle">
          Espécie
        </span>
        <div>
          <v-combobox
            :items="['Cachorro', 'Gato', 'Coelho', 'Passaro', 'Outros']"
            multiple
          ></v-combobox>
        </div>
      </div>

      <div class="filter mt-4">
        <span class="filter-subtitle">
          Ordenar por
        </span>
        <div>
          <v-radio-group v-model="sort">
            <v-radio
              label="Atividade"
              value="activity"
            ></v-radio>

            <v-radio
              label="Distance"
              value="distance"
            ></v-radio>
          </v-radio-group>
        </div>
      </div>
    </v-col>
    <v-col sm="12" md="9">
      <v-row>
        <v-col sm="12" md="4" lg="3" v-for="(post, index) in posts" :key="index">
          <div @click="selectedPost = post">
            <PostCard :post="post"></PostCard>
          </div>
        </v-col>
      </v-row>
    </v-col>
    <PostModal :post="selectedPost" @closeModal="selectedPost=null"></PostModal>
  </v-row>
</template>

<script>
import PostCard from '@/components/Card.vue'
import PostModal from '@/components/PostModal.vue'

export default {
  name: 'LostAndFoundPage',
  layout: "authenticated",
  components: {
    PostCard,
    PostModal
  },
  data: ()=>({
    name: '',
    chipId: '',
    zipcode: '',
    zipcodeDistance: 0,
    found: true,
    lost: true,
    sort: "activity",
    posts: [],
    selectedPost: null
  }),
  async mounted(){
    const query = this.$fire.firestore.collection('posts').orderBy('name').startAt(0).limit(16)
    query.get().then(posts=>{
      posts.forEach(doc=>this.posts.push({id: doc.id, ...doc.data()}))
    })
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

.postContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

</style>
