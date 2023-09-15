<template>
  <v-card>
    <v-card-title class="pa-4">
      <h2 class="text-h5 font-weight-bold">Your Top Genres</h2>
    </v-card-title>

    <v-card-text :class="$style.card_content">
      <!-- <p>You've explored about {{ genreSum }} genres</p> -->
      <Pie style="height: 320px" :data="chartData" :options="chartOptions" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { SpotifyTimeRange } from "~/types";
import { ChartData, ChartOptions } from "chart.js";
import { Pie } from "vue-chartjs";

const { $spotify } = useNuxtApp();

const { data: artists, error } = useAsyncData(async () => {
  return await getAllTopArtists($spotify, SpotifyTimeRange.LongTerm);
});

const chartOptions = ref<ChartOptions<"pie">>({});
const chartColors = ref<string[]>([]);

const chartData = computed<ChartData<"pie">>(() => {
  if (!artists.value) return { datasets: [] };

  const genres = getGenresFromArtists(artists.value);

  const selected = genres.slice(0, 10);
  const labels = [...selected.map((genre) => genre[0]), "other"];
  const counts = [
    ...selected.map((genre) => genre[1]),
    genres.slice(10).reduce((prev, genre) => genre[1], 0),
  ];

  const data: ChartData<"pie"> = {
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
  chartColors.value = getChartColors("darken3");
  configureChart();
});

function configureChart() {
  chartOptions.value = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxHeight: 14,
          boxWidth: 14,
        },
      },
      tooltip: {
        displayColors: false,
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

<style module>
.card_content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
