<template>
  <v-card>
    <v-card-title class="pa-4">
      <h2 class="text-h5 font-weight-bold">Audio Features</h2>
    </v-card-title>

    <v-card-text>
      <Radar :data="chartData" :options="chartOptions" style="height: 320px" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { SpotifyTimeRange } from "~/types";
import { Radar } from "vue-chartjs";
import { ChartData, ChartOptions } from "chart.js";

const appConfig = useAppConfig();
const { $spotify } = useNuxtApp();

const chartOptions = ref<ChartOptions<"radar">>({});

const { data: features, error } = useAsyncData(async () => {
  const tracks = await getAllItems($spotify, {
    url: "/me/top/tracks",
    query: { time_range: SpotifyTimeRange.LongTerm },
  });
  const tracksFeatures = await getTracksAudioFeatures($spotify, tracks);
  return getFeaturesFromTracks(appConfig.audioFeatures, tracksFeatures);
});

const chartData = computed<ChartData<"radar">>(() => {
  if (!features.value) return { datasets: [] };

  return {
    labels: Object.keys(features.value),
    datasets: [
      {
        borderColor: "#BA68C8",
        backgroundColor: "#BA68C877",
        data: Object.values(features.value),
      },
    ],
  };
});

onMounted(() => {
  configureChart();
});

function configureChart() {
  const styles = getComputedStyle(document.documentElement);

  const textColor = styles.getPropertyValue("--text-primary");
  const textSecondaryColor = styles.getPropertyValue("--text-secondary");
  const surfaceColor = styles.getPropertyValue("--v-theme-surface-bright");

  chartOptions.value = {
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 1,
        pointLabels: {
          color: textColor,
          font: { size: 14 },
        },
        ticks: {
          color: textSecondaryColor,
          backdropColor: surfaceColor,
        },
        grid: { color: textSecondaryColor },
        angleLines: { color: textSecondaryColor },
      },
    },
    plugins: { legend: { display: false } },
  };
}
</script>
