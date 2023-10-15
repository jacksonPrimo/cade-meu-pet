    importScripts(
      'https://www.gstatic.com/firebasejs/9.19.1/firebase-app-compat.js'
    )
    importScripts(
      'https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging-compat.js'
    )
    firebase.initializeApp({"apiKey":"AIzaSyAG7-nkXcZOgULM6aEoQwNTemp9PrYI0yY","authDomain":"cade-meu-pet-b7cc8.firebaseapp.com","projectId":"cade-meu-pet-b7cc8","storageBucket":"cade-meu-pet-b7cc8.appspot.com","messagingSenderId":"867991487626","appId":"1:867991487626:web:fa408b8c65db92d0f2d973","measurementId":"G-1NXMPKLNXK"})

    // Retrieve an instance of Firebase Messaging so that it can handle background
    // messages.
    const messaging = firebase.messaging()

    self.addEventListener('push', function (e) {
  console.log("aaaaaaaa")
  data = e.data.json()
  var options = {
    body: data.notification.body,
    icon: data.notification.icon,
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now(), primaryKey: '2' }
  }
  e.waitUntil(self.registration.showNotification(data.notification.title, options))
})
    