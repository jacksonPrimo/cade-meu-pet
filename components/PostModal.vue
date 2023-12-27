<template>
  <v-row justify="center">
    <v-dialog
      v-model="openModal"
      persistent
      scrollable
      max-width="650px"
      style="overflow-x: hidden;"
    >
      <v-card v-if="post">
        <v-card-title class="pt-12">
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
            :src="post.image"
          >
          </v-img>
          <v-card-title>
            Localização
          </v-card-title>
          <selectable-map :canEdit="false" :initialLocation="[post.addressLat, post.addressLng]"></selectable-map>
          <p>{{ post.addressLabel }}</p>
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
            <div v-for="(comment, index) of comments" :key="index">
              <div class="comment-container">
                <div class="comment-image">
                  <img :src="comment.author.profileImage ? comment.author.profileImage : 'images/profile.svg'" alt="Imagem" />
                </div>
                <hr style="width: 50px; margin: 10px 0">
                <div class="comment-description">
                  {{ comment.description }}                
                </div>
                <div class="comment-action" v-if="comment.author.id == userId" @click="deleteComment(comment.id)">
                  <v-btn color="red" small outlined :disabled="comment.id == deletingComment">
                    <v-icon
                      color="red"
                      small
                    >
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </div>
              </div>
              <!-- <hr> -->
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
      const response = await this.$axios.get(`/post/${this.postId}`)
      if(response.status == 200) {
        this.post = response.data
        this.getComments()
      } else {
        this.closeModal()
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
      this.loadingComments = true
      const response = await this.$axios.get(`comment/list?page=${this.page}&limit=${this.limit}&postId=${this.post.id}`)
      this.loadingComments = false
      if(response.status == 200) {
        this.comments = this.comments.concat(response.data.comments)
        this.total = response.data.total
      } else {
        const message = response.message || "Ocorreu um erro ao listar os comentários"
        alert(message)
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
      const response = await this.$axios.post('comment/create', params)
      this.writingComment = false
      if(response.status == 201) {
        this.comments.push(response.data)
      } else {
        const message = response.message || "Ocorreu um erro ao registrar seu comentário"
        alert(message)
      }
    },
    async deleteComment(id){
      this.deletingComment = id
      const response = await this.$axios.delete(`comment/${id}`)
      this.deletingComment = null
      if(response.status == 200) {
        const index = this.comments.findIndex(c => c.id == id)
        this.comments.splice(index, 1)
      } else {
        const message = response.message || 'Desculpe ocorreu um erro ao deletar esse comantário'
        alert(message)
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
  flex-direction: column;
  align-items: center;
  text-wrap: wrap; 
  width: 98%;
  min-height: 30px;
  padding: 10px 0px; 
  margin: 5px 0px;

  .comment-image {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    overflow: hidden;
  }

  .comment-image img {
    width: 100%;
    height: auto;
    display: block;
  }

  .comment-description {
    width: 98%;
    padding: 0 5px;
    text-align: justify;
  }
}
</style>