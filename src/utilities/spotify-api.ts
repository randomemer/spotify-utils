import SpotifyWebApi from "spotify-web-api-js";
import type { App } from "vue";
// import _Vue from "vue";

export const spotify = new SpotifyWebApi();

export default function (app: App<any>) {
  if (app.config && app.config.globalProperties) {
    app.config.globalProperties.$spotify = spotify;
    app.provide("$spotify", spotify);
  }
}
