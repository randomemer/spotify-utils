<template>
  <Card class="card">
    <template #title>
      <h2>Audio Features</h2>
    </template>

    <template #content>
      <Chart
        type="radar"
        :height="320"
        :data="chartData"
        :options="chartOptions"
      />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { SpotifyTimeRange } from "~/types";
import { ChartData, ChartOptions } from "chart.js";

const appConfig = useAppConfig();
const { $spotify } = useNuxtApp();

const chartOptions = ref<ChartOptions>({});

const { data: features, error } = useAsyncData(async () => {
  const tracks = await getAllTopTracks($spotify, SpotifyTimeRange.LongTerm);
  const tracksFeatures = await getTracksAudioFeatures($spotify, tracks);
  return getFeaturesFromTracks(appConfig.audioFeatures, tracksFeatures);
});

const chartData = computed<ChartData>(() => {
  if (!features.value) return { datasets: [] };

  return {
    labels: Object.keys(features.value),
    datasets: [{ data: Object.values(features.value) }],
  };
});

onMounted(() => {
  configureChart();
});

function configureChart() {
  const styles = getComputedStyle(document.documentElement);

  const textSecondaryColor = styles.getPropertyValue("--text-color-secondary");

  chartOptions.value = {
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 1,
        grid: { color: textSecondaryColor },
        angleLines: { color: textSecondaryColor },
      },
    },
    plugins: { legend: { display: false } },
  };
}
</script>

<style scoped lang="scss">
.card {
  :deep(.p-card-title) {
    display: flex;
    justify-content: space-between;

    h2 {
      font-size: inherit;
      line-height: 1.5;
    }
  }
}
</style>
