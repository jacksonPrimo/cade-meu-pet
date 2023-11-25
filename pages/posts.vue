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
            v-model="filters.name"
            label="Nome"
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
          <v-text-field
            outlined
            dense
            v-model="filters.zipcode"
            label="Cep"
          ></v-text-field>
          <v-subheader class="pl-0">
            Distancia máxima {{filters.zipcodeDistance}}km
          </v-subheader>
          <v-slider
            step="10"
            max="50"
            v-model="filters.zipcodeDistance"
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
        <v-btn outlined color="primary" @click="getPosts">Filtrar</v-btn>
      </div>
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

export default {
  name: 'LostAndFoundPage',
  layout: "authenticated",
  components: {
    PostCard,
    PostModal
  },
  data: ()=>({
    page: 0,
    limit: 16,
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
      zipcode: '',
      zipcodeDistance: 0,
      situation: [],
      race: [],
      sort: "created",
      gender: ''
    },
    posts: [],
    selectedPost: null
  }),
  mounted(){
    this.getPosts()
  },
  methods: {
    getPosts(){
      let query = this.$fire.firestore.collection('posts')
      if(this.filters.name) query = query.where('name', '==', this.filters.name)
      if(this.filters.chip) query = query.where('chip', '==', this.filters.chip)
      if(this.filters.zipcode) query = query.where('zipcode', '==', this.filters.zipcode)
      if(this.filters.gender) query = query.where('gender', '==', this.filters.gender)
      if(this.filters.situation.race) query = query.where('race', 'in', extractValues(this.filters.race))
      if(this.filters.situation.length) query = query.where('situation', 'in', extractValues(this.filters.situation))
      const skip = this.page * this.limit
      query.orderBy(this.filters.sort).startAt(skip).limit(this.limit)
      query.get().then(posts=>{
        console.log(posts)
        this.posts = []
        posts.forEach(doc=>this.posts.push({id: doc.id, ...doc.data()}))
      })
    },
    extractValues(selecteds){
      return selecteds.map(s => s.value)
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

.postContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

</style>
