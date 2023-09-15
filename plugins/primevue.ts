import PrimeVue, { type PrimeVueConfiguration } from "primevue/config";

// Components
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import ProgressSpinner from "primevue/progressspinner";

export default defineNuxtPlugin({
  parallel: true,
  setup: (nuxtApp) => {
    const { vueApp } = nuxtApp;

    vueApp.component("ProgressSpinner", ProgressSpinner);
    vueApp.component("Button", Button);
    vueApp.component("DataTable", DataTable);
    vueApp.component("Column", Column);
  },
  hooks: {
    "app:created": (app) => {
      // Doesn't work in setup hook
      app.use(PrimeVue, {
        ripple: true,
        inputStyle: "filled",
      } satisfies PrimeVueConfiguration);
    },
  },
});
