import vuetify from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    async function (_, nuxt) {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config?.plugins?.push(vuetify());
      });
    },
  ],
  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
  },
  app: {
    layoutTransition: { name: "layout", mode: "out-in" },
    pageTransition: { name: "page", mode: "out-in" },
  },
  runtimeConfig: {
    origin: process.dev
      ? `http://localhost:4009`
      : `https://${process.env.VERCEL_DOMAIN}`,
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    serviceAccKey: process.env.SERVICE_ACC_KEY,
  },
  imports: {
    dirs: ["./store"],
  },
  devServer: {
    port: 4009,
  },
});
