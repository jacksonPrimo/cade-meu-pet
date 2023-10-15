<template>
  <div>
    <v-btn @click="startListeners">start listener</v-btn>
    <v-btn @click="requestPermission">request permission</v-btn>
    <v-btn @click="getIdToken">get id token</v-btn>

    <div>
      <v-alert
        v-if="permissionGranted"
        variant="tonal"
        closable
        close-label="Close Alert"
        color="deep-purple-accent-4"
        title="Closable Alert"
      >
        Permissão concedida
      </v-alert>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data(){
    return {
      listenerStarted: false,
      permissionGranted: false,
      idToken: '',
      loading: false
    }
  },
  async mounted(){
    const permission = await navigator.permissions.query({ name: "geolocation" })
    console.log(permission)
    if(permission.state == "granted"){
      navigator.geolocation.getCurrentPosition(resp=>{
        console.log("latitude", resp.coords.latitude)
        console.log("latitude", resp.coords.longitude)
      })
    }
  },
  methods: {
    async requestPermission(){
      try {
        const permission = await Notification.requestPermission()
        console.log(permission)
        this.permissionGranted = permission == 'granted'
      } catch(e){
        console.log(e)
      }
    },
    async getIdToken(){
      console.log(this.$fire)
      this.loading = true
      try {
        this.idToken = await this.$fire.messaging.getToken()
        alert(`the id token ${this.idToken}`)
      } catch (e) {
        this.idToken = ''
        console.error('an erro ocurred', e)
      }
      this.loading = false
    }, 
    startListeners(){
      this.startOnMessageListener()
      // this.startTokenRefreshListener()
      this.listenerStarted = true
    },
    startOnMessageListener(){
      this.$fire.messaging.onMessage((payload)=> {
        console.info('message received', payload)
      })
    },
    startTokenRefreshListener(){
      // this.$fire.messaging.onTokenRefresh(async()=>{
      this.$fire.messaging.onNewToken(async()=>{
        try {
          const refreshedToken = await this.$fire.messaging.getToken()
          this.idToken = refreshedToken
        } catch (e) {
          console.error('unable to retrieve refreshed token', e)
        }
      })
    }
  }
}
</script>
