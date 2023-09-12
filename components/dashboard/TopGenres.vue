<template>
  <Card class="card">
    <template #title>
      <h2>Your Top Genres</h2>
    </template>

    <template #content>
      <p>You've explored about {{ genreSum }} genres</p>

      <Chart
        type="pie"
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

const { $spotify } = useNuxtApp();

const { data: artists, error } = useAsyncData(async () => {
  return await getAllTopArtists($spotify, SpotifyTimeRange.LongTerm);
});

const chartOptions = ref<ChartOptions>({});

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
    datasets: [{ data: counts }],
  };

  return data;
});

const genreSum = computed(() => {
  if (!artists.value) return 0;
  const genres = getGenresFromArtists(artists.value);
  return genres.reduce((prev, genre) => prev + genre[1], 0);
});

onMounted(() => {
  configureChart();
});

function configureChart() {
  const styles = getComputedStyle(document.body);

  chartOptions.value = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxHeight: 14,
          boxWidth: 14,
          color: styles.getPropertyValue("--text-color"),
          font: {
            family: "Lexend",
            size: 12,
          },
        },
      },
      tooltip: {
        displayColors: false,
        bodyFont: {
          family: "Lexend",
          // size: convertRemToPixels(1.2),
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
.card {
  :deep(.p-card-title) {
    display: flex;
    justify-content: space-between;

    h2 {
      font-size: inherit;
      line-height: 1.5;
    }
  }

  :deep(.p-card-content) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
