import SpotifyWebApi from "spotify-web-api-js";
import type { Plugin } from "vue";

export default <Plugin>{
  install(app, options?: any) {
    const spotify = new SpotifyWebApi();
    app.config.globalProperties.$spotify = spotify;
    app.provide("$spotify", spotify);
  },
};
