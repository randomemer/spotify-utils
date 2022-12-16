<script lang="ts">
import DropdownMenu from "@/components/DropdownMenu.vue";
import { UserActivityTimePeriod } from "@/types/enums";
import { convertRemToPixels } from "@/utilities/functions";
import type { DocumentData, DocumentSnapshot } from "@firebase/firestore";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  type ChartData,
  type ChartOptions,
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
  Filler,
  PointElement,
  CategoryScale
);

export default {
  components: { LineChart: Line, DropdownMenu },
  props: {
    history: {
      required: true,
      type: Object as PropType<DocumentSnapshot<DocumentData>>,
    },
  },
  setup() {
    return { UserActivityTimePeriod };
  },
  data() {
    return {
      timeRange: UserActivityTimePeriod.Week,
      chart: undefined as undefined | any,
      timeRanges: {
        Week: UserActivityTimePeriod.Week,
        Month: UserActivityTimePeriod.Month,
        Year: UserActivityTimePeriod.Year,
      },
    };
  },
  computed: {
    chartData(): ChartData<"line"> {
      const now = DateTime.now();
      const labels = [];
      const data: number[] = [];
      const days = new Map<DateTime, number>();

      const json = this.history.get("playback_history.items");
      const items: SpotifyApi.PlayHistoryObject[] = JSON.parse(json);

      switch (this.timeRange) {
        case UserActivityTimePeriod.Week:
          for (let i = 0; i < 7; i++) {
            days.set(now.minus({ day: i }), 0);
          }

          for (const date of days.keys()) {
            for (const { played_at } of items) {
              const track_date = DateTime.fromISO(played_at);
              if (track_date.hasSame(date, "day")) {
                days.set(date, (days.get(date) || 0) + 1);
              }
            }
          }

          for (const key of days.keys()) {
            labels.unshift(key.weekdayShort);
            data.unshift(days.get(key) as number);
          }

          break;

        case UserActivityTimePeriod.Month:
          for (let i = 0; i < 30; i++) {
            days.set(now.minus({ day: i }), 0);
          }

          for (const date of days.keys()) {
            for (const { played_at } of items) {
              const track_date = DateTime.fromISO(played_at);
              if (track_date.hasSame(date, "day")) {
                days.set(date, (days.get(date) || 0) + 1);
              }
            }
          }

          for (const key of days.keys()) {
            labels.unshift(key.toFormat("dd LLL"));
            data.unshift(days.get(key) as number);
          }
          break;

        case UserActivityTimePeriod.Year:
          for (let i = 0; i < 12; i++) {
            days.set(now.minus({ month: i }), 0);
          }

          for (const date of days.keys()) {
            for (const { played_at } of items) {
              const track_date = DateTime.fromISO(played_at);
              if (track_date.hasSame(date, "month")) {
                days.set(date, (days.get(date) || 0) + 1);
              }
            }
          }

          for (const key of days.keys()) {
            labels.unshift(key.monthShort);
            data.unshift(days.get(key) as number);
          }
          break;

        default:
          break;
      }

      let gradient;
      const chartRef = this.$refs.chart;
      console.log(chartRef);
      if (chartRef) {
        const { chart } = chartRef;
        if (chart) {
          console.log(chart);
          const context = chart.ctx;
          gradient = context?.createLinearGradient(0, 0, 0, 0);
          gradient?.addColorStop(0, "rgba(115,0,153,0.3)");
          gradient?.addColorStop(1, "rgba(115,0,153,1)");
          console.log(gradient);
        } else {
          console.log("Chart was null");
        }
      } else {
        console.log("No Chart Found");
      }

      console.log(data);

      return {
        labels,
        datasets: [
          {
            data,
            fill: {
              target: "origin",
              above: gradient,
            },
          },
        ],
      };
    },
    chartOptions(): ChartOptions<"line"> {
      const axisStyle = {
        title: {
          display: true,
          font: {
            size: convertRemToPixels(1.6),
          },
          color: "white",
        },
        ticks: {
          padding: 15,
          font: {
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
        responsive: true,
        maintainAspectRatio: false,
        borderColor: "#bf00ff",
        backgroundColor: "#bf00ff",
        tension: 0.3,
        font: { family: "Lexend Deca, sans-serif" },
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
      };
    },
  },
  methods: {
    changeActivityPeriod(range: UserActivityTimePeriod) {
      this.timeRange = range;
    },
  },
};
</script>

<template>
  <div class="card">
    <div class="card-title-row">
      <h3 class="heading-tertiary">Recent Activity</h3>
      <DropdownMenu
        class="time-period-dropdown"
        name="select-activity-period"
        v-on:value-change="changeActivityPeriod"
        :default-value="UserActivityTimePeriod.Week"
        :options="
          Object.entries(timeRanges).map(([label, value]) => ({ label, value }))
        "
      />
    </div>

    <LineChart
      ref="chart"
      :chart-data="chartData"
      :chart-options="chartOptions"
    />
  </div>
</template>

<style scoped lang="scss">
@import "./activity.scss";

.time-period-dropdown {
  float: right;
  font-size: 1.4rem;
}
</style>
