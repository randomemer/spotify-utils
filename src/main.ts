import { createApp } from "vue";
import VueCookies from "vue-cookies";
import App from "./App.vue";
import router from "./router";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import spotifyApi from "./utilities/spotify-api";

// Firebase Setup
const env = import.meta.env;

export const firebaseApp = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_MEASUREMENT_ID,
});
export const db = getFirestore(firebaseApp);

// Vue Setup
const app = createApp(App);

app.use(router);
app.use(VueCookies, { expire: "7d" });
app.use(spotifyApi);
app.mount("#app");

console.log(app);
export default app;
