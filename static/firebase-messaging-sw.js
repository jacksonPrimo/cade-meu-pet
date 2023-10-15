    importScripts(
      'https://www.gstatic.com/firebasejs/9.19.1/firebase-app-compat.js'
    )
    importScripts(
      'https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging-compat.js'
    )
    firebase.initializeApp({"apiKey":undefined,"authDomain":undefined,"projectId":undefined,"storageBucket":undefined,"messagingSenderId":undefined,"appId":undefined,"measurementId":undefined})

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
    