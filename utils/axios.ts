import { Axios } from "axios";

const axios = new Axios({
  baseURL: "https://pet-connection-api.vercel.app/"
})

axios.interceptors.request.use((config) => {
  let token = localStorage.getItem("authToken")
  config.headers.Authorization = `Bearer ${token}`
  config.headers["Content-Type"] = "application/json"
  config.data = JSON.stringify(config.data)
  return config;
});

axios.interceptors.response.use((config) => {
  config.data = JSON.parse(config.data)
  return config;
});

export { axios }