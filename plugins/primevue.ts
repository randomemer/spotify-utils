import PrimeVue, { type PrimeVueConfiguration } from "primevue/config";

// Components
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";

export default defineNuxtPlugin({
  parallel: true,
  setup: (nuxtApp) => {
    const { vueApp } = nuxtApp;

    vueApp.component("ProgressSpinner", ProgressSpinner);
    vueApp.component("Button", Button);
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
