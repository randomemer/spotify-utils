import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      api: axios.create({
        baseURL: nuxtApp.$config.public.webOrigin,
        withCredentials: true,
      }),
      spotify: axios.create({ baseURL: "https://api.spotify.com/v1" }),
    },
  };
});
