<template>
  <v-row justify="center" style="z-index: 10000">
    <v-dialog
      :persistent="config.persistent"
      v-model="open"
      min-width="290"
      max-width="400"
    >
      <v-card>
        <div class="text-center pt-3">
          <v-icon style="font-size: 85px;" :color="config.success ? 'success' : 'red'">
            {{ config.success ? "mdi-check-circle-outline" : "mdi-alert-circle-outline" }}
          </v-icon>
        </div>

        <v-card-text class="text-h6 text-center">
          {{ config.description }}
        </v-card-text>

        <v-card-actions style="display: flex; justify-content: center;">
          <v-btn
            v-if="config.agreeBtn"
            color="green darken-1"
            @click="agree"
            text
          >
            {{ config.agreeBtn }}
          </v-btn>

          <v-btn
            v-if="config.disagreeBtn"
            color="red darken-1"
            @click="disagree"
            text
          >
            {{ config.disagreeBtn }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    props: {
      config: {
        type: Object,
        required: true,
        default: () =>({
          description: "",
          disagreeBtn: null,
          agreeBtn: null,
          success: true,
          persistent: false
        })
      },
      open: {
        type: Boolean,
        required: true
      },
    },
    methods: {
      agree(){
        this.$emit("agree")
      },
      disagree(){
        this.$emit("disagree")
      }
    }
  }
</script>