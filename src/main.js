import { createApp } from "vue";
import App from "./App.vue";
import VueCookies from 'vue3-cookies'

import "./assets/main.css";

import store from './store'

const app = createApp(App);
app.use(store);
app.use(VueCookies,{
    expireTimes: "30d",
    domain : "*",
    secure: false,
});

app.mount("#app");
