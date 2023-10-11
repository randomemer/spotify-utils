import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

export default defineNuxtPlugin({
  parallel: true,
  hooks: {
    "app:created": () => {
      ChartJS.register(
        RadialLinearScale,
        ArcElement,
        PointElement,
        LineElement,
        Filler,
        Tooltip,
        Legend
      );
    },
    "app:beforeMount": () => {
      const styles = getComputedStyle(document.documentElement);

      ChartJS.defaults.font.family = `"Lexend", sans-serif`;
      ChartJS.defaults.color = styles.getPropertyValue("--text-primary");
    },
  },
});
