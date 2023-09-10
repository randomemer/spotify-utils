import PrimeVue from "primevue/config";

// Components
import Card from "primevue/card";
import ProgressSpinner from "primevue/progressspinner";

export default defineNuxtPlugin((nuxtApp) => {
  const { vueApp } = nuxtApp;
  vueApp.use(PrimeVue, { ripple: true });

  vueApp.component("Card", Card);
  vueApp.component("ProgressSpinner", ProgressSpinner);
});
