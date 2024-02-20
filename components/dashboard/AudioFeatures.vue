<template>
  <v-card>
    <v-card-title class="pa-4">
      <h2 class="text-h5 font-weight-bold">Audio Features</h2>
    </v-card-title>

    <v-card-text>
      <FeaturesChart
        v-if="features"
        id="features-chart"
        :features="features"
        :chart-options="chartOptions"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { SpotifyTimeRange } from "~/types";
import type { ChartOptions } from "chart.js";

const appConfig = useAppConfig();
const { $spotify } = useNuxtApp();

const { data: features, error } = useAsyncData(async () => {
  const tracks = await getAllItems($spotify, {
    url: "/me/top/tracks",
    query: { time_range: SpotifyTimeRange.LongTerm },
  });
  const tracksFeatures = await getTracksAudioFeatures($spotify, tracks);
  return getFeaturesFromTracks(appConfig.audioFeatures, tracksFeatures);
});

const chartOptions: ChartOptions<"radar"> = {
  scales: {
    r: {
      pointLabels: {
        font: { size: 14 },
      },
    },
  },
  plugins: { legend: { display: false } },
};
</script>

<style scoped>
#features-chart {
  height: 20rem;
}
</style>
