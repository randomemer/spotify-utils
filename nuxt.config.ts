// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["vuetify/styles"],
  modules: ["@pinia/nuxt", "vuetify-nuxt-module"],
  imports: {
    dirs: ["./store"],
  },
  devServer: {
    port: 4009,
  },
  app: {
    layoutTransition: { name: "layout", mode: "out-in" },
    pageTransition: { name: "page", mode: "out-in" },
  },
  runtimeConfig: {
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    serviceAccKey: process.env.SERVICE_ACC_KEY,
  },
  vuetify: {
    vuetifyOptions: "./vuetify.config.ts",
    moduleOptions: { styles: { configFile: "/assets/css/settings.scss" } },
  },
  // Disabling inlineSSRStyles as it's not compatiable with Vuetify
  experimental: { inlineSSRStyles: false },
});
