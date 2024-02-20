<template>
  <div class="chart-wrapper">
    <Pie class="chart" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from "chart.js";
import { Pie } from "vue-chartjs";
import _ from "lodash";

interface GenresChartProps {
  genres: Record<string, number>;
  chartOptions?: ChartOptions<"pie"> | null | undefined;
}

const props = defineProps<GenresChartProps>();

const chartOptions = ref<ChartOptions<"pie">>({});
const chartColors = ref<string[]>([]);

const genreSum = computed(() => _.sum(_.values(props.genres)));

const chartData = computed<ChartData<"pie">>(() => {
  let entries = Object.entries(props.genres);
  entries = _.sortBy(entries, (pair) => -pair[1]);
  const [labels, counts] = _.zip(...entries);

  const maxItems = _.clamp(entries.length, 0, 10);
  labels.splice(maxItems);
  counts.splice(maxItems);
  const colors = chartColors.value.slice(0, maxItems);

  if (entries.length > 10) {
    labels.push("other");
    counts.push(entries.slice(10).reduce((prev, genre) => prev + genre[1], 0));
    colors.push(chartColors.value.at(-1) as string);
  }

  const data: ChartData<"pie"> = {
    labels,
    datasets: [{ backgroundColor: colors, data: counts as number[] }],
  };

  return data;
});

onMounted(() => {
  const colours = getChartColors("darken3");
  chartColors.value = colours;
  // console.log("hot computed", colours);
  // console.log("chart colors :", chartColors.value);
  configureChart();
});

function configureChart() {
  const defaultOptions: ChartOptions<"pie"> = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        boxPadding: 5,
        callbacks: {
          label(tooltipItem) {
            const dataPoint = tooltipItem.dataset.data[tooltipItem.dataIndex];
            const percent = (dataPoint / genreSum.value) * 100;
            return percent.toFixed(2) + "%";
          },
        },
      },
    },
  };
  // @ts-ignore
  chartOptions.value = _.merge(defaultOptions, props.chartOptions);
}
</script>
