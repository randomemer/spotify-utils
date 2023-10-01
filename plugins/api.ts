import axios from "axios";
import useAuthStore from "~/store/auth.store";

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
      const authStore = useAuthStore();

      $nuxt.$spotify.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${authStore.token?.access_token}`;
        return config;
      });
    },
  },
});
