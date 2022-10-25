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
    return {
      timeRange: "week",
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderColor: "#bf00ff",
        borderCapStyle: "round",
        borderJoinStyle: "round",
        tension: 0.3,
        scales: {
          x: {
            title: {
              text: "Time",
              font: {
                family: "Lexend Deca, sans-serif",
                size: convertRemToPixels(1.4),
              },
              color: "white",
            },
            ticks: {
              font: {
                family: "Lexend Deca, sans-serif",
                size: convertRemToPixels(1.4),
              },
              color: "white",
            },
            grid: { display: false },
          },
          y: {
            title: {
              text: "No. of Tracks",
              color: "white",
              font: {
                family: "Lexend Deca, sans-serif",
                size: convertRemToPixels(1.4),
              },
            },
            ticks: {
              font: {
                family: "Lexend Deca, sans-serif",
                size: convertRemToPixels(1.4),
              },
              color: "white",
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
            // callbacks: {
            //   label: function (context: any) {
            //     const dataPoint = context.dataset.data[context.dataIndex];
            //     const percent: string = ((dataPoint / genreSum) * 100).toFixed(2);
            //     return `${context.label} : ${percent}%`;
            //   },
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

          console.log(days);

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

<style scoped>
@import "./activity.css";
</style>
