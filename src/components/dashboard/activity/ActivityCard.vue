<script lang="ts">
import { convertRemToPixels } from "@/utilities/functions";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { DateTime } from "luxon";
import type { PropType } from "vue";
import { Line } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
);

export default {
  components: { LineChart: Line },
  props: {
    history: {
      required: true,
      type: Object as PropType<SpotifyApi.UsersRecentlyPlayedTracksResponse>,
    },
  },
  data() {
    const axisStyle = {
      title: {
        display: true,
        font: {
          family: "Lexend Deca, sans-serif",
          size: convertRemToPixels(1.6),
        },
        color: "white",
      },
      ticks: {
        padding: 15,
        font: {
          family: "Lexend Deca, sans-serif",
          size: convertRemToPixels(1.4),
        },
        color: "white",
      },
      grid: {
        drawTicks: false,
        color: "rgba(256,256,256,0.1)",
        borderColor: "rgba(256,256,256,0.1)",
      },
    };

    return {
      timeRange: "week",
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderColor: "#bf00ff",
        backgroundColor: "#bf00ff",
        borderCapStyle: "round",
        borderJoinStyle: "round",
        tension: 0.3,
        scales: {
          x: {
            ...axisStyle,
            title: {
              ...axisStyle.title,
              text: ["Time"],
            },
            grid: { ...axisStyle.grid, display: false },
          },
          y: {
            ...axisStyle,
            title: {
              ...axisStyle.title,
              text: "# of Tracks",
            },
          },
        },
        plugins: {
          tooltip: {
            displayColors: false,
            bodyFont: {
              family: "Lexend Deca, sans-serif",
              size: convertRemToPixels(1.2),
            },
          },
          legend: {
            display: false,
          },
        },
      },
    };
  },
  computed: {
    chartData(): any {
      const now = DateTime.now();
      let labels = [];
      let data = [];
      const days = new Map<DateTime, number>();
      switch (this.timeRange) {
        case "week":
          for (let i = 0; i < 7; i++) {
            days.set(now.minus({ day: i }), 0);
          }

          for (const date of days.keys()) {
            for (const { played_at } of this.history.items) {
              const track_date = DateTime.fromISO(played_at);
              if (track_date.hasSame(date, "day")) {
                days.set(date, (days.get(date) || 0) + 1);
              }
            }
          }

          for (const key of days.keys()) {
            labels.unshift(key.weekdayShort);
            data.unshift(days.get(key));
          }

          break;

        default:
          break;
      }

      return {
        labels,
        datasets: [
          {
            data,
          },
        ],
      };
    },
  },
};
</script>

<template>
  <div class="card">
    <h3 class="heading-tertiary">Recent Activity</h3>

    <LineChart :chart-data="chartData" :chart-options="chartOptions" />
  </div>
</template>

<style scoped lang="scss">
@import "./activity.scss";
</style>
