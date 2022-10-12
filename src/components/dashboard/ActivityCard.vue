<script setup lang="ts">
import Spotify from "spotify-web-api-js";
import { inject } from "vue";
import type { VueCookies } from "vue-cookies";

const $cookies = inject<VueCookies>("$cookies");
if (!$cookies) throw Error("Couldn't fetch cookies");
const spotify = new Spotify();
spotify.setAccessToken($cookies.get("access_token"));

// const devices = await spotify.getAvailableGenreSeeds();
// console.log(devices);

// const recommends = await spotify.getRecommendations({
//   seed_genres: [],
// });
// console.log(recommends);
</script>

<template>
  <div class="card">
    <h3 class="heading-tertiary">Recent Activity</h3>
  </div>
</template>

<style scoped></style>
