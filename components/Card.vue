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
      <v-card-title>{{ post.name }}</v-card-title>
    </v-img>

    <v-card-subtitle class="pb-0">
      <span>
        postado há: {{ createdAt }}
      </span>
    </v-card-subtitle>

    <v-card-text class="text--primary">
      <div>Gênero: {{gender}}</div>
      <div>Raça: {{ race }}</div>
    </v-card-text>

    <v-card-actions style="padding: 0">
      <v-alert
        style="width: 100%; margin: 0"
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
import { situationOpt, specieOpt, genderOpt } from '@/static/postOptions'
export default {
  name: 'Card',
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
        case 'adoption':
          return {
            color: '#FFD600',
            icon: 'mdi-rabbit',
            title: 'Para adoção'
          }
      }
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
    createdAt(){
      const dataAtual = new Date();
      const diferenca = dataAtual.getTime() - new Date(this.post.postedAt);

      const segundos = Math.floor(diferenca / 1000);
      const minutos = Math.floor(segundos / 60);
      const horas = Math.floor(minutos / 60);
      const dias = Math.floor(horas / 24);
      const meses = Math.floor(dias / 30);
      const anos = Math.floor(meses / 12);

      if (anos > 0) {
        return `${anos} ano${anos > 1 ? 's' : ''} atrás`;
      } else if (meses > 0) {
        return `${meses} mês${meses > 1 ? 'es' : ''} atrás`;
      } else if (dias > 0) {
        return `${dias} dia${dias > 1 ? 's' : ''} atrás`;
      } else if (horas > 0) {
        return `${horas} hora${horas > 1 ? 's' : ''} atrás`;
      } else if (minutos > 0) {
        return `${minutos} minuto${minutos > 1 ? 's' : ''} atrás`;
      } else {
        return `${segundos} segundo${segundos !== 1 ? 's' : ''} atrás`;
      }
    }
  }
}
</script>

<style lang="scss">
</style>