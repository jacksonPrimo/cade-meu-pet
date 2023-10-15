<template>
  <div class="container-box">
    <div class="box">
      <v-row>
        <v-col class="red text-center">1</v-col>
        <v-col class="purple text-center">2</v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
  }),
  async mounted(){
  },
  methods: {
  }
}
</script>

<style>
.container-box {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  width: 90%;
  height: 80%;
  border-radius: 20px;
}
</style>