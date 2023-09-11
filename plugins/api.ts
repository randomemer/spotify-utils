import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  // Vercel system variables are only available at runtime
  updateAppConfig({
    webOrigin: process.dev
      ? `http://localhost:4009`
      : `https://${process.env.VERCEL_DOMAIN}`,
  });

  console.log(nuxtApp._appConfig);

  return {
    provide: {
      api: axios.create({
        baseURL: nuxtApp._appConfig.webOrigin,
        withCredentials: true,
      }),
      spotify: axios.create({ baseURL: "https://api.spotify.com/v1" }),
    },
  };
});
