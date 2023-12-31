<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="posts"
      :options.sync="options"
      class="elevation-1"
      :loading="loading"
      loading-text="Carregando... Aguarde um momento"
      hide-default-footer
      disable-sort
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <span>Você ainda não possui publicações</span>
      </template>
    </v-data-table>
    <div class="text-center" v-if="total > 1">
      <v-pagination
        v-model="page"
        :length="total"
      ></v-pagination>
    </div>
    <v-dialog v-model="deleteAlert" max-width="500px">
      <v-card>
        <v-card-title class="text-h5 pt-12">Deseja realmente excluir esta publicação?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteAlert = false">Cancelar</v-btn>
          <v-btn :disabled="waitingDelete" color="red darken-1" text @click="confirmDeleteItem">Deletar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <edit-post-modal v-if="selectedPostToEdit" :selectedPost="selectedPostToEdit" @closeModal="selectedPostToEdit=null" @updatedPost="updatePosts"></edit-post-modal>
  </div>
</template>

<script>
import EditPostModal from '@/components/EditPostModal'
import { situationOpt, specieOpt, genderOpt } from '@/static/postOptions'

export default {
  name: "MyPosts",
  layout: "authenticated",
  components: {
    EditPostModal
  },
  data: () => ({
    headers: [
      { text: 'Nome', value: 'name' },
      { text: 'Postado em', value: 'postedAt' },
      { text: 'chip', value: 'chip' },
      { text: 'situação', value: 'situationFormatted' },
      { text: 'Raça', value: 'raceFormatted' },
      { text: 'Gênero', value: 'genderFormatted' },
      { text: 'Ações', value: 'actions', sortable: false },
    ],
    posts: [],
    page: 1,
    limit: 20,
    total: 0,
    loading: true,
    options: {},
    selectedPostToDelete: null,
    selectedPostToEdit: null,
    deleteAlert: false,
    waitingDelete: false
  }),
  async mounted(){
    this.getPosts()
  },
  watch: {
    page: {
      handler () {
        this.getPosts()
      },
      deep: true,
    },
  },
  methods: {
    async getPosts(){
      this.loading = true
      const response = await this.$axios.get(`/post/my?page=${this.page}&limit=${this.limit}`)
      this.loading = false
      if(response.status == 200) {
        this.posts = this.formatPosts(response.data.posts)
        this.total = response.data.total
      } else {
        alert(response.message || 'Ocorreu um erro ao listar suas publicações')
      }
    },
    formatPosts(posts){
      const genders = genderOpt()
      const species = specieOpt()
      const situations = situationOpt()
      return posts.map(post=>{
        post.genderFormatted = genders.find(o=>o.value == post.gender).text
        post.raceFormatted = species.find(o=>o.value == post.race).text
        post.situationFormatted = situations.find(o=>o.value == post.situation).text
        return post
      })
    },
    editItem(item) {
      this.selectedPostToEdit = item
    },
    deleteItem(item){
      this.selectedPostToDelete = item
      this.deleteAlert = true
    },
    async confirmDeleteItem() {
      this.waitingDelete = true
      const item = this.selectedPostToDelete
      const response = await this.$axios.delete(`/post/${item.id}`)
      this.waitingDelete = false
      this.deleteAlert = false
      if(response.status == 200) {
        const index = this.posts.findIndex(p=>p.id == item.id)
        this.posts.splice(index, 1)
      } else {
        alert(response.message || 'Ocorreu um erro ao deletar sua publicação')
      }
    },
    updatePosts(){
      this.getPosts()
    }
  }
}
</script>