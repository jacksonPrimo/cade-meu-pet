<template>
  <v-row justify="center">
    <v-dialog
      v-model="openModal"
      persistent
      max-width="600px"
      scrollable
      style="overflow-x: hidden;"
    >
      <v-card v-if="post">
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
          <selectable-map :canEdit="false" :initialLocation="[post.addressLat, post.addressLng]"></selectable-map>
          <v-card-title>Outras informações</v-card-title>
          <p>Gênero: {{ gender }}</p>
          <p>Raça: {{ race }}</p>
          <p>Chip: {{ post.chip }}</p>
          <p>Situação: {{ situation }}</p>
          <p v-if="post.situation == 'lost'">Recompensa: {{ post.reward }}</p>
          <p>Descrição: {{ post.description }}</p>
          <v-card-title>Dados de contato</v-card-title>
          <p>Telefone: {{ post.author.phone }}</p>
          <p>Email: {{ post.author.email }}</p>
          <v-card-title>Comentarios</v-card-title>
          <div class="pl-2 pr-2">
            <v-textarea
              solo
              auto-grow
              name="input-7-4"
              label="Deixe um comentário"
              v-model="comment"
              :disabled="writingComment"
              @keydown.enter="writeAComment"
            ></v-textarea>
          </div>
          <div class="ml-2 mb-2">
            <div class="comment-container" v-for="(comment, index) of comments" :key="index">
              <img class="comment-image" :src="comment.author.profileImage"/>
              <div class="comment-description">
                {{ comment.description }}                
              </div>
              <div class="comment-action" v-if="comment.author.id == userId">
                <v-icon
                  color="red"
                  small
                  :disabled="comment.id == deletingComment"
                  @click="deleteComment(comment.id)"
                >
                  mdi-delete
                </v-icon>
              </div>
            </div>
            <div v-if="showMoreComments" class="text-center">
              <a @click="loadMoreComments">Carregar mais</a>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { getAuthData } from '@/utils/auth'
import { situationOpt, specieOpt, genderOpt } from '@/static/postOptions'
import SelectableMap from '@/components/selectableMap.vue'

export default {
  components: {
    SelectableMap
  },
  props: {
    postId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    post: null,
    loadingPost: false,
    comment: "",
    writingComment: false,
    deletingComment: null,
    loadingComments: false,
    comments: [],
    page: 1,
    limit: 10,
    total: 0,
    userId: ""
  }),
  mounted(){
    this.userId = getAuthData().userId
    this.getPost()
  },
  methods: {
    async getPost(){
      try {
        const response = await this.$axios.get(`/post/${this.postId}`)
        this.post = response.data
        this.getComments()
      } catch(e) {
        this.closeModal()
        console.log(e)
      }
    },
    closeModal(){
      this.comments = []
      this.$emit('closeModal')
    },
    loadMoreComments(){
      if(this.loadingComments) return
      this.page += 1
      this.getComments()
    },
    async getComments(){
      try {
        this.loadingComments = true
        const response = await this.$axios.get(`comment/list?page=${this.page}&limit=${this.limit}&postId=${this.post.id}`)
        this.comments = this.comments.concat(response.data.comments)
        this.total = response.data.total
        this.loadingComments = false
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
      this.writingComment = true
      try {
        const response = await this.$axios.post('comment/create', params)
        this.comments.push(response.data)
      } catch(e) {
        alert(e.response.data.message)
      }
      this.writingComment = false
    },
    async deleteComment(id){
      try {
        this.deletingComment = id
        await this.$axios.delete(`comment/${id}`)
        const index = this.comments.findIndex(c => c.id == id)
        this.comments.splice(index, 1)
      } catch(e) {
        alert('Desculpe ocorreu um erro ao deletar esse comantário')
        console.log(e)
      } finally {
        this.deletingComment = null
      }
    }
  },
  computed: {
    openModal(){
      return !!this.post
    },
    gender(){
      const options = genderOpt()
      return options.find(o=>o.value == this.post.gender).text
    },
    race(){
      const options = specieOpt()
      return options.find(o=>o.value == this.post.race).text
    },
    situation(){
      const options = situationOpt()
      return options.find(o=>o.value == this.post.situation).text
    },
    showMoreComments(){
      return this.total > 1 && this.total !== this.page
    }
  }
}
</script>

<style lang="scss">
.comment-container {
  display: flex;
  flex-direction: row;
  text-wrap: wrap; 
  width: 98%;
  min-height: 30px;
  padding: 10px 5px; 
  margin: 5px 2px;
  background-color: rgba(0, 0, 0, 0.253);
  border-radius: 5px;

  .comment-image {
    width: 23px;
    height: 23px;
    border-radius: 50%;
  }

  .comment-description {
    width: 90%;
    padding: 0 5px;
    text-align: justify;
  }
}
</style>