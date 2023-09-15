<template>
  <v-card class="card">
    <template #title>
      <h2 class="text-h5 font-weight-bold">Your Top Genres</h2>
    </template>

    <template #text class="card-content">
      <p>You've explored about {{ genreSum }} genres</p>

      <p>
        <Chart
          type="pie"
          :height="320"
          :data="chartData"
          :options="chartOptions"
        />
      </p>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { SpotifyTimeRange } from "~/types";
import { ChartData, ChartOptions } from "chart.js";

const { $spotify } = useNuxtApp();

const { data: artists, error } = useAsyncData(async () => {
  return await getAllTopArtists($spotify, SpotifyTimeRange.LongTerm);
});

const chartOptions = ref<ChartOptions>({});
const chartColors = ref<string[]>([]);

const chartData = computed<ChartData>(() => {
  if (!artists.value) return { datasets: [] };

  const genres = getGenresFromArtists(artists.value);

  const selected = genres.slice(0, 10);
  const labels = [...selected.map((genre) => genre[0]), "other"];
  const counts = [
    ...selected.map((genre) => genre[1]),
    genres.slice(10).reduce((prev, genre) => genre[1], 0),
  ];

  const data: ChartData = {
    labels,
    datasets: [{ backgroundColor: chartColors.value, data: counts }],
  };

  return data;
});

const genreSum = computed(() => {
  if (!artists.value) return 0;
  const genres = getGenresFromArtists(artists.value);
  return genres.reduce((prev, genre) => prev + genre[1], 0);
});

onMounted(() => {
  chartColors.value = getChartColors(600);
  configureChart();
});

function configureChart() {
  const styles = getComputedStyle(document.body);

  const textColor = styles.getPropertyValue("--text-color");
  const fontFamily = styles.getPropertyValue("--font-family");

  chartOptions.value = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxHeight: 14,
          boxWidth: 14,
          color: textColor,
          font: {
            family: fontFamily,
            size: 12,
          },
        },
      },
      tooltip: {
        displayColors: false,
        bodyFont: {
          family: fontFamily,
        },
        callbacks: {
          label: function (context) {
            const dataPoint = context.dataset.data[context.dataIndex] as number;
            const percent: string = (
              (dataPoint / genreSum.value) *
              100
            ).toFixed(2);
            return `${context.label} : ${percent}%`;
          },
        },
      },
    },
  };
}
</script>

<style scoped lang="scss">
:deep(.card) {
  :deep(.p-card-title) {
    display: flex;
    justify-content: space-between;
  }

  :deep(.v-card-text) {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>
