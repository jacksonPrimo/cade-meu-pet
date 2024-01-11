<template>
  <v-row justify="center">
    <v-dialog
      :persistent="config.persistent"
      v-model="open"
      max-width="290"
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

        <v-card-actions class="text-center">
          <v-spacer></v-spacer>

          <v-btn
            v-if="config.disagreeBtn"
            color="green darken-1"
            text
          >
            {{ config.disagreeBtn }}
          </v-btn>

          <v-btn
            v-if="config.agreeBtn"
            color="green darken-1"
            text
          >
            {{ config.agreeBtn }}
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
  }
</script>