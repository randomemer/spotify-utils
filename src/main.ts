import { createApp } from "vue";
import VueCookies from "vue-cookies";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);
app.use(VueCookies, { expire: "7d" });
app.mount("#app");

export default app;
