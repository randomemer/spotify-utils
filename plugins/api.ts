import axios from "axios";

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig();

  return {
    provide: {
      api: axios.create({
        baseURL: appConfig.origin,
        withCredentials: true,
      }),
      spotify: axios.create({ baseURL: "https://api.spotify.com/v1" }),
    },
  };
});
