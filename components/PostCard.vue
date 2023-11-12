<template>
  <v-card
    class="mx-auto"
    max-width="400"
  >
    <v-img
      class="white--text align-end"
      height="200px"
      :src="post.image"
    >
      <v-card-title>Nina</v-card-title>
    </v-img>

    <v-card-subtitle class="pb-0">
      <span class="mr-2">
        id: {{post.id}}
      </span>
      <span>
        postado há: {{ post.created }}
      </span>
    </v-card-subtitle>

    <v-card-text class="text--primary">
      <div>Idade: {{ post.age }} anos</div>
      <div>Sexo: {{sex}}</div>
      <div>Raça: {{ post.race }}</div>
    </v-card-text>

    <v-card-actions color="green">
      <v-alert
        style="width: 100%;"
        dark
        :color="styleSituation.color"
        :icon="styleSituation.icon"
        border="right"
      >
        {{ styleSituation.title }}
      </v-alert>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'PostCard',
    props: {
      post: {
        type: Object,
        required: true,
      },
    },
    computed: {
      styleSituation(){
        switch(this.post.situation){
          case 'lost' :
            return {
              color: '#EF5350',
              icon: 'mdi-emoticon-sad',
              title: 'Perdido'
            }
          case 'found':
            return {
              color: '#00BFA5',
              icon: 'mdi-paw',
              title: 'Procurando Tutor'
            }
        }
      },
      sex(){
        return this.post.sex == 'F' ? 'Fêmea' : 'Macho'
      }
    }
  }
</script>

<style lang="scss">
</style>