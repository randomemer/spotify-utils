<script setup lang="ts">
import Spotify from "spotify-web-api-js";
import { inject, ref, watch } from "vue";
import type { VueCookies } from "vue-cookies";
import { IonIcon } from "@ionic/vue";
import { chevronBack, chevronForward } from "ionicons/icons";
import { useRoute, useRouter } from "vue-router";

const $cookies = inject<VueCookies>("$cookies");
const route = useRoute();
const spotify = new Spotify();
const pageItemsCount = 20;

if (!$cookies) throw Error("Couldn't fetch cookies");
spotify.setAccessToken($cookies.get("access_token"));

let curPage = ref(Number(route.params.page) || 1);

let history = ref(
  await spotify.getMyRecentlyPlayedTracks({
    limit: pageItemsCount,
  })
);
console.log(history.value);

watch(history, async () => {});

const dateFormat = (timestamp: number) =>
  `${new Date(timestamp).toDateString()}`;
const timeFormat = (timestamp: number) =>
  `${new Date(timestamp).toLocaleTimeString()}`;

// const router = useRouter();
const previousPage = async () => {
  curPage.value = Math.max(1, curPage.value - 1);
  history.value = await spotify.getMyRecentlyPlayedTracks({
    limit: 20,
    after: Number(history.value.cursors.after),
  });

  // router.push({
  //   path: window.location.pathname,
  //   query: { page: curPage.value },
  // });
};
const nextPage = async () => {
  curPage.value++;
  history.value = await spotify.getMyRecentlyPlayedTracks({
    limit: pageItemsCount,
    before: Number(history.value.cursors.before),
  });

  // router.push({
  //   path: window.location.pathname,
  //   query: {
  //     page: ++curPage.value,
  //   },
  // });
};
</script>

<template>
  <table class="history-table" cellspacing="0">
    <!-- Table Header -->
    <thead>
      <th>#</th>
      <th>Track</th>
      <!-- <th>Genre</th> -->
      <th>Popularity</th>
      <th>Time</th>
    </thead>
    <!-- Table Rows -->
    <tbody>
      <tr v-for="(item, index) in history.items" :key="item.track.id">
        <td>{{ index + 1 }}</td>
        <td class="track">
          <img class="track-image" :src="item.track.album.images[0].url" />
          <div class="track-info">
            <span>{{ item.track.name }}</span>
            <ul class="track-artists">
              <li v-for="artist in item.track.artists" :key="artist.id">
                {{ artist.name }}
              </li>
            </ul>
          </div>
        </td>
        <td>{{ item.track.popularity }}</td>
        <td>
          <div class="track-played-at">
            <span>{{ timeFormat(Date.parse(item.played_at)) }}</span>
            <span>{{ dateFormat(Date.parse(item.played_at)) }}</span>
          </div>
        </td>
      </tr>
    </tbody>
    <!-- Table Footer -->
    <tfoot>
      <tr>
        <td colspan="4">
          <div class="table-footer">
            <div class="button-group">
              <button
                class="data-nav-button"
                v-on:click="previousPage"
                v-if="curPage !== 1"
              >
                <ion-icon :icon="chevronBack"></ion-icon>
                <span>Previous</span>
              </button>
              <button class="data-nav-button" v-on:click="nextPage">
                <span>Next</span>
                <ion-icon :icon="chevronForward"></ion-icon>
              </button>
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<style scoped>
.history-table {
  background-color: rgba(255, 255, 255, 0.1);
  width: 100%;
  border-radius: 10px;
  /* padding: 3rem; */
}

.history-table th {
  font-size: 1.6rem;
  text-transform: uppercase;
  color: #bbb;
  padding: 1.2rem 0;
  border-bottom: 1px solid grey;
}

.history-table tbody td {
  text-align: center;
  font-size: 1.6rem;
  margin: 1.2rem 0;
}

.button-group {
  display: flex;
  align-self: flex-end;
}

.history-table tfoot td {
  padding: 2.4rem;
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* gap: ; */
  width: 100%;
}

.track {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.track-image {
  --size: 5rem;
  height: var(--size);
  width: var(--size);
  border-radius: var(--size);
  object-fit: cover;
}

.track-info {
  display: flex;
  flex-direction: column;
  text-align: start;
  gap: 1rem;
}

.track-artists {
  display: flex;
  list-style: none;
  color: #bbb;
  font-size: 1.4rem;
}

.track-artists li + li:before {
  content: ", ";
}

.track-played-at {
  display: flex;
  flex-direction: column;
}

.data-nav-button {
  background: none;
  display: flex;
  align-items: center;
  /* gap: 5px; */
  padding: 0.8rem 1.6rem;
  border-radius: 5px;
  color: #1db954;
  font-size: 1.8rem;
}
</style>
