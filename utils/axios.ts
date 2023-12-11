import { Axios } from "axios";
 
let baseURL
if(window.location.href.includes("localhost")) {
  baseURL = "http://localhost:3000/"
} else {
  baseURL = "" //url da api de prod
}

const axios = new Axios({
  baseURL,
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