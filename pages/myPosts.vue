<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="posts"
      :options.sync="options"
      class="elevation-1"
      :loading="loading"
      loading-text="Loading... Please wait"
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
        <v-btn
          color="primary"
          @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteAlert" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Deseja realmente excluir esta publicação?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteAlert = false">Cancelar</v-btn>
          <v-btn :disabled="waitingDelete" color="red darken-1" text @click="confirmDeleteItem">Deletar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "MyPosts",
  layout: "authenticated",
  data: () => ({
    headers: [
      { text: 'Nome', value: 'name' },
      { text: 'Postado em', value: 'postedAt' },
      { text: 'chip', value: 'chip' },
      { text: 'situação', value: 'situation' },
      { text: 'Raça', value: 'race' },
      { text: 'Gênero', value: 'gender' },
      { text: 'Ações', value: 'actions', sortable: false },
    ],
    posts: [],
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
    options: {
      handler () {
        this.getPosts()
      },
      deep: true,
    },
  },
  methods: {
    async getPosts(){
      try {
        const { page, itemsPerPage } = this.options
        const response = await this.$axios.get(`/post/my?page=${page}&itemsPerPage=${itemsPerPage}`)
        this.posts = response.data.posts
        this.total = response.data.total
      } catch(e) {
        alert('Ocorreu um erro ao listar suas publicações')
      } finally {
        this.loading = false
      }
    },
    editItem(item) {
      console.log('edit item', item)
    },
    deleteItem(item){
      this.selectedPostToDelete = item
      this.deleteAlert = true
    },
    async confirmDeleteItem() {
      try {
        this.waitingDelete = true
        const item = this.selectedPostToDelete
        await this.$axios.delete(`/post/${item.id}`)
        const index = this.posts.findIndex(p=>p.id == item.id)
        this.posts.splice(index, 1)
      } catch(e) {
        alert('Ocorreu um erro ao deletar sua publicação')
      } finally {
        this.deleteAlert = false
        this.waitingDelete = false
      }
    }
  }
}
</script>