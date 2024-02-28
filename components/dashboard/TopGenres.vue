<template>
  <v-card>
    <v-card-title class="pa-4">
      <h2 class="text-h5 font-weight-bold">Your Top Genres</h2>
    </v-card-title>

    <v-card-text :class="$style.card_content">
      <p>You've explored about {{ genreSum }} genres</p>
      <GenresChart
        v-if="genres"
        id="top-genres-chart"
        :genres="genres"
        :chart-options="chartOptions"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { ChartOptions } from "chart.js";
import _ from "lodash";
import { SpotifyTimeRange } from "~/types";

const { $spotify } = useNuxtApp();

const { data: artists, error } = useAsyncData(
  async () => {
    return await getAllItems($spotify, {
      url: "/me/top/artists",
      query: { time_range: SpotifyTimeRange.LongTerm },
      max: 50,
    });
  },
  { server: false }
);

const genres = computed(
  () => artists.value && getGenresFromArtists(artists.value)
);

const genreSum = computed(() => _.sum(_.values(genres.value)));

const chartOptions: ChartOptions<"pie"> = {
  plugins: {
    legend: {
      position: "right",
      labels: {
        boxHeight: 14,
        boxWidth: 14,
      },
    },
  },
};
</script>

<style module>
.card_content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>

<style scoped>
#top-genres-chart {
  height: 17.5rem;
}
</style>
