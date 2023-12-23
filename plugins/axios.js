export default function ({ $axios, redirect }) {
  $axios.onRequest(request => {
    let token = localStorage.getItem("authToken")
    request.headers.Authorization = `Bearer ${token}`
    request.headers["Content-Type"] = "application/json"
    request.data = JSON.stringify(request.data)
    return request;
   })
  $axios.onError(error => {
    const code = parseInt(error.response?.status || "500")
    if (code === 401) {
      localStorage.removeItem('authToken')
      redirect('/')
    } else {
      return {
        code,
        message: error.response?.data?.message
      }
    }
  })
}