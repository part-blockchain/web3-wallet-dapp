import { createApp } from "vue";
import "./style.css";
import { createPinia } from "pinia";
import Vue3Toastify from "vue3-toastify";
import App from "./App.vue";
const pinia = createPinia();
createApp(App).use(pinia).use(Vue3Toastify, { autoClose: 3000 }).mount("#app");


// import elTableSticky from '@cell-x/el-table-sticky'
// createApp(App).use(elTableSticky, {
//   StickyHeader: {
//     // 吸顶偏移量，可以是 CSS 支持的距离值，如 `0px`、`10%`、`calc(100vh - 1rem)` 等
//     offsetTop: 0,
//     // 滚动条吸底偏移量，可以是 CSS 支持的距离值，如 `0px`、`10%`、`calc(100vh - 1rem)` 等
//     offsetBottom: 0,
//   },
//   StickyFooter: {
//     // 吸底偏移量，可以是 CSS 支持的距离值，如 `0px`、`10%`、`calc(100vh - 1rem)` 等
//     offsetBottom: 0,
//   },
//   StickyScroller: {
//     // 吸底偏移量，可以是 CSS 支持的距离值，如 `0px`、`10%`、`calc(100vh - 1rem)` 等
//     offsetBottom: 0,
//   },
//   HeightAdaptive: {
//     // 底部偏移量，只能是数字型
//     offsetBottom: 0,
//   }
// })