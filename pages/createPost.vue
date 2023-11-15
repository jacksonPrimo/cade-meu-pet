<template>
  <v-row>
    <v-col cols="6 first-column"></v-col>
    <v-col cols="6 second-column">
      <v-stepper v-model="e6" vertical>

        <basic-info :currentStep="e6" @next="next"></basic-info>

        <identify :currentStep="e6" @next="next" @previous="previous"></identify>

        <v-stepper-step
          :complete="e6 > 3"
          step="3"
        >
          Localização
        </v-stepper-step>

        <v-stepper-content step="3">
          <v-card
            color="grey lighten-1"
            class="mb-12"
            height="200px"
          ></v-card>
          <v-btn
            color="primary"
            @click="e6 = 4"
          >
            Continue
          </v-btn>
          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>

        <v-stepper-step step="4">
          View setup instructions
        </v-stepper-step>
        <v-stepper-content step="4">
          <v-card
            color="grey lighten-1"
            class="mb-12"
            height="200px"
          ></v-card>
          <v-btn
            color="primary"
            @click="e6 = 1"
          >
            Continue
          </v-btn>
          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script>
import BasicInfo from '@/components/Steps/BasicInfo.vue'
import Identify from '@/components/Steps/Identify.vue'
export default {
  components: { BasicInfo, Identify },
  name: 'CreatePost',
  layout: "authenticated",
  data: () => ({
    e6: 1,
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
    ]
  }),
  methods: {
    next(){
      this.e6 += 1
    },
    previous(){
      this.e6 -= 1
    }
  }
}
</script>

<style lang="scss">
  .first-column {
    height: 90vh;
    background-image: url("../static/images/found.jpg");
    /* Image by <a href="https://www.freepik.com/free-photo/small-dog-being-adorable-studio_15615918.htm#query=animais&position=19&from_view=search&track=sph&uuid=1e54d905-dad0-4749-99a1-774e48f5867e">Freepik</a> */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>