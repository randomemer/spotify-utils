import { defineComponent, h, type PropType } from "vue";

import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  type ChartConfiguration,
} from "chart.js";
import type { Plugin, ChartData, ChartOptions } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default defineComponent({
  name: "DonutChart",
  components: {
    Doughnut,
  },
  props: {
    chartData: {
      type: Object as PropType<ChartData>,
      required: true,
    },
    chartOptions: {
      type: Object as PropType<ChartOptions>,
      required: true,
    },
    chartId: {
      type: String,
      default: "doughnut-chart",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object as PropType<Partial<CSSStyleDeclaration>>,
      default: () => {},
    },
    plugins: {
      type: Array as PropType<Plugin<"doughnut">[]>,
      default: () => [],
    },
  },
  setup(props) {
    console.log(props);

    const config: ChartConfiguration = {};

    return () =>
      h(Doughnut, {
        chartData: props.chartData,
        chartOptions: props.chartOptions,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins,
      });
  },
});
