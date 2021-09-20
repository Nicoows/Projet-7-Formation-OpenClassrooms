import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css' 
import '@fortawesome/fontawesome-free/js/all.js'

import axios from "axios";
axios.defaults.baseURL = 'http://localhost:3000/api/';
const token = sessionStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}
//createApp.prototype.$axios = axios;

createApp(App).use(router).mount('#app')