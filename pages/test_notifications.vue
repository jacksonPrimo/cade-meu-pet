<template>
  <div>
    <v-btn @click="addNotification">Add Notifications</v-btn>
    <br/>
    <span>Error {{ errorData }}</span>
  </div>
</template>

<script>
export default {
  data: () => ({
    errorData: ""
  }),
  async mounted(){
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    });
    if ('Notification' in window) {
      // Solicita permissão do usuário para exibir notificações
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Permissão concedida para exibir notificações!');
          
          // Exibe uma notificação push
          self.registration.showNotification('Título da notificação', {
            body: 'Corpo da notificação',
            icon: '/icon.png'
          });
        } else {
          console.log('Permissão negada para exibir notificações!');
        }
      });
    }

    // navigator.serviceWorker.ready.then(registration=>{
    //   console.log(registration)
    //   registration.showNotification("Vibration Sample", {
    //     body: "Buzz! Buzz!",
    //     vibrate: [200, 100, 200, 100, 200, 100, 200],
    //     tag: "vibration-sample",
    //   });
    // }).catch(error=>console.log(error))
    self.addEventListener('push', function (e) {
      data = e.data.json()
      var options = {
        body: data.notification.body,
        icon: data.notification.icon,
        vibrate: [100, 50, 100],
        data: { dateOfArrival: Date.now(), primaryKey: '2' }
      }
      e.waitUntil(self.registration.showNotification(data.notification.title, options))
    })
    // setInterval(()=>{
    //   const time = new Date()
    //   new Notification("alou ", time)
    // }, 2000)
  },
  methods: {
    addNotification(){
      try {
        // const notification = new Notification("alou")
        // ServiceWorkerRegistration.showNotification("aaaaaaaaa")
        const notificationTitle = 'Nova notificação!';
        const notificationOptions = {
          body: 'Esta é uma nova notificação push!',
          // icon: '/icon.png'
        };
        showNotification(notificationTitle, notificationOptions);
      }
      catch(error){
        this.errorData = error
      }
    }
  }
}
</script>

<style>

</style>