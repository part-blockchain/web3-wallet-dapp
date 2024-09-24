import { createApp } from "vue";
import ElementPlus from 'element-plus'

import { createPinia } from "pinia";
import Vue3Toastify from "vue3-toastify";
import "./style.css";
import 'element-plus/dist/index.css'

import App from "./App.vue";
const pinia = createPinia();
createApp(App).use(pinia).use(Vue3Toastify, { autoClose: 3000 }).mount("#app");
