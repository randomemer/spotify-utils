<template>
  <div>
    <Radar :data="chartData" :options="chartOptions" style="height: 280px" />
  </div>
</template>

<script setup lang="ts">
import { ChartData, ChartOptions } from "chart.js";
import { Radar } from "vue-chartjs";

interface FeaturesChartProps {
  features: Record<string, number>;
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
