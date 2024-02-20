import axios from "axios";
import useUserStore from "~/store/user.store";

export default defineNuxtPlugin({
  parallel: true,
  setup: (nuxtApp) => {
    return {
      provide: {
        api: axios.create({
          baseURL: `${nuxtApp.$config.public.origin}/api`,
          withCredentials: true,
        }),
        spotify: axios.create({ baseURL: "https://api.spotify.com/v1" }),
      },
    };
  },
  hooks: {
    "app:created": ({ $nuxt }) => {
      const authStore = useUserStore();

      $nuxt.$spotify.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`;
        return config;
      });
    },
  },
});
