import { Axios } from "axios";
 
let baseURL
if(window.location.href.includes("localhost")) {
  baseURL = "http://localhost:3000/"
} else {
  baseURL = "" //url da api de prod
}

let token = localStorage.getItem("authToken")

const axios = new Axios({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }
})

axios.interceptors.request.use((config) => {
  config.data = JSON.stringify(config.data)
  return config;
});

axios.interceptors.response.use((config) => {
  config.data = JSON.parse(config.data)
  return config;
});

export { axios }