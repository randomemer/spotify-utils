<template>
  <div>
    <Pie :data="chartData" :options="chartOptions" style="height: 280px" />
  </div>
</template>

<script setup lang="ts">
import { ChartData, ChartOptions } from "chart.js";
import { Pie } from "vue-chartjs";
import _ from "lodash";

interface GenresChartProps {
  genres: Record<string, number>;
}

const props = defineProps<GenresChartProps>();

const chartOptions = ref<ChartOptions<"pie">>({});
const chartColors = ref<string[]>([]);

const chartData = computed<ChartData<"pie">>(() => {
  let entries = Object.entries(props.genres);
  entries = _.sortBy(entries, (pair) => -pair[1]);
  const [labels, counts] = _.zip(...entries);

  const maxItems = _.clamp(entries.length, 0, 10);
  labels.splice(maxItems);
  counts.splice(maxItems);
  const colors = chartColors.value.splice(0, maxItems);

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
  chartColors.value = getChartColors("darken3");
  configureChart();
});

function configureChart() {
  chartOptions.value = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          // label: function (context) {
          //   const dataPoint = context.dataset.data[context.dataIndex] as number;
          //   const percent: string = (
          //     (dataPoint / genreSum.value) *
          //     100
          //   ).toFixed(2);
          //   return `${context.label} : ${percent}%`;
          // },
        },
      },
    },
  };
}
</script>
