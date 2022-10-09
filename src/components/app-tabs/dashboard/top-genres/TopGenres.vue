<script setup lang="ts">
import { inject } from "vue";
import type { VueCookies } from "vue-cookies";
import Spotify from "spotify-web-api-js";
import { UserTopItemsSort } from "@/types/types";
import { getAllTopTracks, convertRemToPixels } from "@/utilities/functions";
import VueApexCharts from "vue3-apexcharts";
import type { ApexOptions } from "apexcharts";

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

// Get artist data in batches of size 50 in accordance with
// Spotify API rate limits
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
const total = sortedGenres.reduce((prev, cur) => prev + cur[1], 0);
// Create a conic gradient using the data
// prettier-ignore
// eslint-disable-next-line prettier/prettier
const materialColours = ["#f44336", "#00bcd4", "#9c27b0", "#03a9f4", "#4caf50", "#e91e63", "#3f51b5", "#ffc107", "#673ab7", "#009688"];
let coloured = 0;
const coloursCount = Math.min(10, sortedGenres.length);
const topGenres: {
  genre: string;
  value: string;
  color: string;
  gradient: string;
}[] = [];
for (let i = 0; i < coloursCount; i++) {
  const percent = (sortedGenres[i][1] / total) * 100;
  topGenres.push({
    genre: sortedGenres[i][0],
    value: percent.toFixed(2),
    color: materialColours[i],
    gradient: `${materialColours[i]} ${coloured}% ${coloured + percent}%`,
  });
  coloured += percent;
}
if (sortedGenres.length > 10) {
  topGenres.push({
    genre: "other",
    value: (100 - coloured).toFixed(2),
    color: "#795548",
    gradient: `#795548 ${coloured}% 100%`,
  });
}
const pieChart = `conic-gradient(${topGenres
  .map((genre) => genre.gradient)
  .join(", ")})`;

const donutOptions: ApexOptions = {
  chart: {
    type: "donut",
    fontFamily: "Gotham, sans-serif",
    foreColor: "#ffffff ",
  },
  dataLabels: { enabled: false },
  series: [
    ...sortedGenres.slice(0, 10).map((genre) => genre[1]),
    sortedGenres.slice(10).reduce((prev, cur) => prev + cur[1], 0),
  ],
  labels: [...sortedGenres.slice(0, 10).map((genre) => genre[0]), "other"],
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex }) {
      return (
        '<div class="arrow_box">' +
        "<span>" +
        series[seriesIndex][dataPointIndex] +
        "</span>" +
        "</div>"
      );
    },
  },
  plotOptions: { pie: { donut: { size: "28px" } } },
  legend: {
    // tooltipHoverFormatter: function (legendName, opts) {
    //   return "";
    // },
    fontSize: `${convertRemToPixels(1.4)}px`,
  },
};

console.log(donutOptions);
</script>

<template>
  <div class="card">
    <h3 class="heading-tertiary">Your Top Genres</h3>

    <p class="summary">
      You've listened to {{ sortedGenres.length }} different genres.
    </p>

    <VueApexCharts
      class="apex-donut-chart"
      :options="donutOptions"
      :series="donutOptions.series"
    />

    <!-- <div class="data-area">
      <div class="pie-chart" :style="{ background: pieChart }"></div>

      <ul class="legend">
        <li class="genre" v-for="(genre, index) in topGenres" :key="index">
          <span
            class="genre-colour"
            :style="{ backgroundColor: genre.color }"
          ></span>
          <span>{{ genre.value }} % </span>
          <span>{{ genre.genre }}</span>
        </li>
      </ul>
    </div> -->
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;

  grid-column: span 2;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2.4rem;
}

.card * {
  transition: all 0.3s;
}

.data-area {
  display: flex;
  gap: 4.8rem;
}

/* .apex-donut-chart {
  width: 12.6rem;
  height: 9.6rem;
} */

.summary {
  font-size: 1.6rem;
}

.pie-chart {
  --diameter: 18rem;
  height: var(--diameter);
  width: var(--diameter);
  border-radius: 50%;
}

.legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2.4rem;
  /* grid-template-rows: repeat(6, 1fr); */
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
