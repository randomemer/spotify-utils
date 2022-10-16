<script setup lang="ts">
import { delay } from "@/utilities/functions";
import { IonIcon } from "@ionic/vue";
import { chevronBack, chevronForward } from "ionicons/icons";
import Spotify from "spotify-web-api-js";
import { inject, ref, watch } from "vue";
import type { VueCookies } from "vue-cookies";
import { useRoute, useRouter } from "vue-router";
import type { RecentlyPlayedTracks } from "@/types/types";

const $cookies = inject<VueCookies>("$cookies");
const route = useRoute();
const spotify = new Spotify();
const pageItemsCount = 20;

if (!$cookies) throw Error("Couldn't fetch cookies");
spotify.setAccessToken($cookies.get("access_token"));

let curPage = ref(Number(route.params.page) || 1);

let history = ref(
  (await spotify.getMyRecentlyPlayedTracks({
    limit: pageItemsCount,
  })) as RecentlyPlayedTracks
);
console.log(history.value);

watch(history, async () => {});

const dateFormat = (timestamp: number) =>
  `${new Date(timestamp).toDateString()}`;
const timeFormat = (timestamp: number) =>
  `${new Date(timestamp).toLocaleTimeString()}`;

const router = useRouter();
const previousPage = async () => {
  curPage.value = Math.max(1, curPage.value - 1);
  history.value = (await spotify.getMyRecentlyPlayedTracks({
    limit: 20,
    after: Number(history.value.cursors.after),
  })) as RecentlyPlayedTracks;

  // router.push({
  //   path: window.location.pathname,
  //   query: { page: curPage.value },
  // });
};
const nextPage = async () => {
  curPage.value++;
  history.value = (await spotify.getMyRecentlyPlayedTracks({
    limit: pageItemsCount,
    before: Number(history.value.cursors.before),
  })) as RecentlyPlayedTracks;

  // router.push({
  //   path: window.location.pathname,
  //   query: {
  //     page: ++curPage.value,
  //   },
  // });
};

await delay(5 * 1000);
</script>

<template>
  <table class="history-table" cellspacing="0">
    <!-- Table Header -->
    <thead>
      <th class="track-number">#</th>
      <th>Track</th>
      <!-- <th>Genre</th> -->
      <th>Popularity</th>
      <th>Time</th>
    </thead>
    <!-- Table Rows -->
    <tbody>
      <tr v-for="({ track, played_at }, index) in history.items" :key="index">
        <td class="track-number">
          {{ index + 1 }}
        </td>
        <td>
          <div class="track">
            <img class="track-image" :src="track.album.images[0].url" />
            <div class="track-info">
              <span>{{ track.name }}</span>
              <ul class="track-artists">
                <li v-for="artist in track.artists" :key="artist.id">
                  {{ artist.name }}
                </li>
              </ul>
            </div>
            <!-- <iframe
            style="border-radius: 12px"
            src="https://open.spotify.com/embed/track/4EyPadLFhtWojU7mkT5hqT?utm_source=generator&theme=0"
            width="100%"
            height="75"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe> -->
          </div>
        </td>
        <td>
          <div class="track-popularity">
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ width: `${Number(track.popularity)}%` }"
              ></div>
            </div>
            <span>{{ track.popularity }}%</span>
          </div>
        </td>
        <td>
          <div class="track-played-at">
            <span>{{ timeFormat(Date.parse(played_at)) }}</span>
            <span>{{ dateFormat(Date.parse(played_at)) }}</span>
          </div>
        </td>
      </tr>
    </tbody>
    <!-- Table Footer -->
    <tfoot>
      <tr>
        <td class="table-footer">
          <div>
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
  display: grid;
  align-items: center;
  justify-content: stretch;
  grid-template-columns: auto 1fr auto auto;
  background-color: rgba(255, 255, 255, 0.1);
  min-width: 100%;
  border-radius: 10px;
  border-collapse: collapse;
  grid-row-gap: 1.6rem;
  /* grid-column-gap: 2rem; */
  /* padding: 2rem; */
  /* column-rule: 1px solid aqua; */
  overflow-y: hidden;
}

.history-table thead,
.history-table tbody,
.history-table tfoot,
.history-table tr {
  display: contents;
}

.history-table th {
  position: sticky;
  top: 0;
  background-color: rgba(64, 64, 64);
  text-transform: uppercase;
  color: #1db954;
  padding: 1.2rem 0;
  text-align: left;
  border-bottom: 1px solid grey;
}

.history-table th,
.history-table td {
  font-size: 1.6rem;
  padding-left: 1.1rem;
  padding-right: 1.1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

tr td:nth-child(:first-child),
tr td:nth-child(:last-child) {
  background-color: rgba(255, 255, 255, 0.085);
}

.button-group {
  display: flex;
  align-self: flex-end;
}

.history-table .track-number {
  padding-left: 2.4rem;
  padding-right: 2.4rem;
  text-align: center;
}

.table-footer {
  padding: 1.2rem 1.8rem;
  border-top: 1px solid grey;
  grid-column: span 4;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  gap: 10px;
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

.track-popularity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.track-played-at {
  display: flex;
  flex-direction: column;
  gap: 8px;
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

.bar-track {
  width: 10rem;
  height: 1.4rem;
  background-color: black;
  border-radius: 10rem;
}

.bar-fill {
  height: 1.4rem;
  border-radius: 10rem;
  background-color: #1db954;

  transition: width 0.3s;
}
</style>
