import { createApp } from "vue";
import VueCookies from "vue-cookies";
import App from "./App.vue";
import router from "./router";
import spotifyApi from "./utilities/spotify-api";
import "@/backend";

// Vue Setup
const app = createApp(App);

app.use(router);
app.use(VueCookies, { expire: "7d" });
app.use(spotifyApi);
app.mount("#app");

export default app;
