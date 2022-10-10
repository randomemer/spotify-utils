<script setup lang="ts">
import { inject } from "vue";
import type { VueCookies } from "vue-cookies";
import Spotify from "spotify-web-api-js";
import { UserTopItemsSort } from "@/types/types";
import { getAllTopTracks, convertRemToPixels } from "@/utilities/functions";
import { Doughnut } from "vue-chartjs";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

const start = Date.now();

Chart.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const $cookies = inject<VueCookies>("$cookies");
if (!$cookies) throw new Error("Couldn't find cookies");
const token = $cookies.get("access_token");
const spotify = new Spotify();
spotify.setAccessToken(token);

const tracks = await getAllTopTracks(UserTopItemsSort.Long, token);
// console.log(tracks);

// Collect all of the artists in the tracks
const unknownArtists = new Set<string>();
tracks.forEach((track) => {
  track.artists.forEach((artist) => {
    unknownArtists.add(artist.id);
  });
});

// Get artist data in batches of size 50 in accordance with Spotify API rate limits
// eslint-disable-next-line no-undef
const knownArtists = new Map<string, SpotifyApi.ArtistObjectFull>();
const artistsArr = Array.from(unknownArtists);
do {
  const batch = await spotify.getArtists(artistsArr.splice(0, 50));
  batch.artists.forEach((artist) => knownArtists.set(artist.id, artist));
} while (artistsArr.length > 0);

const genres = new Map<string, number>();
tracks.forEach((track) => {
  track.artists.forEach((artist) => {
    const artistInfo = knownArtists.get(artist.id);
    artistInfo?.genres.forEach((genre) => {
      const count = genres.get(genre);
      if (count) genres.set(genre, count + 1);
      else genres.set(genre, 1);
    });
  });
});

const sortedGenres = Array.from(genres).sort(
  (genreA, genreB) => genreB[1] - genreA[1]
);
const genreSum = sortedGenres.reduce((prev, cur) => prev + cur[1], 0);

// prettier-ignore
const materialColours = ["#f44336", "#00bcd4", "#9c27b0", "#03a9f4", "#4caf50", "#e91e63", "#3f51b5", "#ffc107", "#673ab7", "#009688", "#bbbbbb"];

const data: any = {
  labels: [...sortedGenres.slice(0, 10).map((genre) => genre[0]), "other"],
  datasets: [
    {
      backgroundColor: materialColours,
      data: [
        ...sortedGenres.slice(0, 10).map((genre) => genre[1]),
        sortedGenres.slice(10).reduce((prev, cur) => prev + cur[1], 0),
      ],
    },
  ],
};

const chartOptions: any = {
  radius: convertRemToPixels(12.8),
  cutout: "60%",
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      displayColors: false,
      bodyFont: {
        family: "Gotham, sans-serif",
        size: convertRemToPixels(1.2),
      },
      callbacks: {
        label: function (context: any) {
          const dataPoint = context.dataset.data[context.dataIndex];
          const percent: string = ((dataPoint / genreSum) * 100).toFixed(2);
          return `${context.label} : ${percent}%`;
        },
      },
    },
    legend: {
      position: "right",
      labels: {
        boxWidth: convertRemToPixels(1.4),
        color: "white",
        font: {
          family: "Gotham, sans-serif",
          size: convertRemToPixels(1.4),
        },
      },
    },
  },
};
console.log(((Date.now() - start) / 1000).toFixed(3));
</script>

<template>
  <div class="card">
    <h3 class="heading-tertiary">Your Top Genres</h3>

    <p class="summary">
      You've listened to {{ sortedGenres.length }} different genres.
    </p>

    <div class="donut-chart-container">
      <Doughnut
        :chart-data="data"
        :chart-options="chartOptions"
        chart-id="genres-donut"
      />
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  /* grid-column: span 2; */
  /* grid-column: 75fr; */
}

.card * {
  transition: all 0.3s;
}

.data-area {
  display: flex;
  gap: 4.8rem;
}

.summary {
  font-size: 1.6rem;
}

.chatjs {
  display: fixed;
}

/* .donut-chart-container {
  display: flex;
  justify-content: space-between;
} */

/* :deep(#genres-donut) {
  background-color: grey;
} */

:deep(.donut-tooltip) {
  /* background-color: v-bind(tooltipColor); */
  text-transform: capitalize;
  font-size: 1.2rem;
  padding: 0.8rem;
  display: block;
}

.legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  list-style: none;
}

.genre {
  display: flex;
  gap: 1.2rem;
  font-size: 1.4rem;
  text-transform: capitalize;
}

.genre-colour {
  --size: 1.6rem;
  width: var(--size);
  height: var(--size);
  border-radius: var(--size);
}
</style>
