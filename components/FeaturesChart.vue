<template>
  <div class="chart-wrapper">
    <Radar class="chart" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from "chart.js";
import { Radar } from "vue-chartjs";
import _ from "lodash";

interface FeaturesChartProps {
  features: Record<string, number>;
  chartOptions?: ChartOptions<"radar"> | null | undefined;
}

const props = defineProps<FeaturesChartProps>();

const chartOptions = ref<ChartOptions<"radar">>({});

const chartData = computed<ChartData<"radar">>(() => {
  return {
    labels: Object.keys(props.features),
    datasets: [
      {
        borderColor: "#BA68C8",
        backgroundColor: "#BA68C877",
        data: Object.values(props.features),
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

  const defaultOptions: ChartOptions<"radar"> = {
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 1,
        pointLabels: {
          color: textColor,
        },
        ticks: {
          color: textSecondaryColor,
          backdropColor: surfaceColor,
        },
        grid: { color: textSecondaryColor },
        angleLines: { color: textSecondaryColor },
      },
    },
    plugins: { legend: { display: false }, tooltip: { boxPadding: 5 } },
  };

  // @ts-ignore
  chartOptions.value = _.merge(defaultOptions, props.chartOptions);
}
</script>
