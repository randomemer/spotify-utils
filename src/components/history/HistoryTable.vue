<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { chevronBack, chevronForward } from "ionicons/icons";
import Spotify from "spotify-web-api-js";
import { inject, ref, watch } from "vue";
import type { VueCookies } from "vue-cookies";
import type { RecentlyPlayedTracks } from "@/types/types";

const $cookies = inject<VueCookies>("$cookies");
const spotify = new Spotify();
const pageItemsCount = 20;

if (!$cookies) throw Error("Couldn't fetch cookies");
spotify.setAccessToken($cookies.get("access_token"));

// Functions
async function checkNextPage(currentPage: RecentlyPlayedTracks) {
  const next = await spotify.getMyRecentlyPlayedTracks({
    limit: pageItemsCount,
    before: Number(currentPage.cursors.before),
  });
  console.log(next);
  return Boolean(next?.items.length > 0);
}

// Refs
const curPage = ref(1);
const isLoading = ref(false);
const history = ref(
  (await spotify.getMyRecentlyPlayedTracks({
    limit: pageItemsCount,
  })) as RecentlyPlayedTracks
);
const hasNext = ref(await checkNextPage(history.value));
console.log(history.value);

watch(curPage, async (cur, prev) => {
  isLoading.value = true;

  if (cur - prev === 1) {
    history.value = (await spotify.getMyRecentlyPlayedTracks({
      limit: pageItemsCount,
      before: Number(history.value.cursors.before),
    })) as RecentlyPlayedTracks;
  } else if (cur - prev === -1) {
    history.value = (await spotify.getMyRecentlyPlayedTracks({
      limit: 20,
      after: Number(history.value.cursors.after),
    })) as RecentlyPlayedTracks;
  }

  hasNext.value = await checkNextPage(history.value);
  isLoading.value = false;
});

const dateFormat = (timestamp: number) =>
  `${new Date(timestamp).toDateString()}`;
const timeFormat = (timestamp: number) =>
  `${new Date(timestamp).toLocaleTimeString()}`;

const previous = () => {
  if (isLoading.value) return;
  curPage.value = Math.max(1, curPage.value - 1);
};
const next = () => {
  if (isLoading.value) return;
  curPage.value++;
};
</script>

<template>
  <table class="history-table">
    <!-- Table Header -->
    <thead>
      <tr>
        <th class="track-number">#</th>
        <th>Track</th>
        <th>Popularity</th>
        <th>Time</th>
      </tr>
    </thead>
    <!-- Table Rows -->
    <tbody>
      <tr v-for="({ track, played_at }, index) in history.items" :key="index">
        <td class="track-number">
          {{ index + 1 }}
        </td>
        <td>
          <div class="track">
            <a class="link" :href="track.external_urls.spotify" target="_blank">
              <img class="track-image" :src="track.album.images[0].url" />
            </a>
            <div class="track-info">
              <a class="track-name link" :href="track.external_urls.spotify">{{
                track.name
              }}</a>
              <ul class="track-artists">
                <li
                  class="track-artisit"
                  v-for="artist in track.artists"
                  :key="artist.id"
                >
                  <a
                    :href="artist.external_urls.spotify"
                    class="link"
                    target="_blank"
                  >
                    {{ artist.name }}
                  </a>
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
                @click="previous"
                :disabled="curPage === 1 && !isLoading"
              >
                <ion-icon :icon="chevronBack"></ion-icon>
              </button>
              <span class="page-index">{{ curPage }}</span>
              <button
                class="data-nav-button"
                @click="next"
                :disabled="!hasNext && !isLoading"
              >
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
  /* overflow-y: hidden; */
  --table-padding: 3rem;
}

.history-table thead,
.history-table tbody,
.history-table tfoot,
.history-table tr {
  display: contents;
}

.history-table th {
  /* position: sticky; */
  /* top: 0; */
  /* background-color: rgba(64, 64, 64); */
  text-transform: uppercase;
  color: #1db954;
  padding: 1.6rem 0;
  text-align: left;
  font-weight: 500;
  letter-spacing: 1px;
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

/* Left padding for table */
.history-table td:first-child,
.history-table th:first-child {
  padding-left: var(--table-padding);
}

/* Right padding for table */
.history-table td:last-child,
.history-table th:last-child {
  padding-right: var(--table-padding);
}

.button-group {
  display: flex;
  align-items: stretch;
  gap: 1.8rem;
}

.history-table .track-number {
  padding-left: 2.4rem;
  padding-right: 2.4rem;
  text-align: center;
}

.table-footer {
  padding: 1.6rem 0;
  border-top: 1px solid grey;
  grid-column: span 4;
  display: flex;
  align-items: center;
  justify-content: center;
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
  text-transform: uppercase;
  padding: 0.5rem;
  border-radius: 5px;
  color: #1db954;
  font-size: 2.4rem;
  transition: background 0.3s ease-out;
  cursor: auto;
}

.data-nav-button:disabled {
  color: #bbb;
}

.data-nav-button:not(:disabled):hover,
.data-nav-button:not(:disabled):active {
  background-color: rgba(29, 185, 84, 0.1);
  cursor: pointer;
}

.page-index {
  font-size: 1.8rem;
  text-align: center;
  display: flex;
  align-items: center;
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
  width: 0;
}
</style>
