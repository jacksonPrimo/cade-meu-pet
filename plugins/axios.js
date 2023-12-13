export default function ({ $axios, redirect }) {
  $axios.onRequest(config => {
    let token = localStorage.getItem("authToken")
    config.headers.Authorization = `Bearer ${token}`
    config.headers["Content-Type"] = "application/json"
    config.data = JSON.stringify(config.data)
    return config;
   }),

   $axios.onResponse(config => {
      config.data = JSON.parse(config.data)
      return config;
   })
}