import PrimeVue, { type PrimeVueConfiguration } from "primevue/config";

// Directives
import Tooltip from "primevue/tooltip";

// Components
import Card from "primevue/card";
import ProgressSpinner from "primevue/progressspinner";
import Sidebar from "primevue/sidebar";
import Menu from "primevue/menu";
import Listbox from "primevue/listbox";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Chart from "primevue/chart";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export default defineNuxtPlugin((nuxtApp) => {
  const { vueApp } = nuxtApp;
  vueApp.use(PrimeVue, {
    ripple: true,
    inputStyle: "filled",
  } satisfies PrimeVueConfiguration);

  vueApp.component("Card", Card);
  vueApp.component("ProgressSpinner", ProgressSpinner);
  vueApp.component("Sidebar", Sidebar);
  vueApp.component("Menu", Menu);
  vueApp.component("Listbox", Listbox);
  vueApp.component("Button", Button);
  vueApp.component("Avatar", Avatar);
  vueApp.component("Dropdown", Dropdown);
  vueApp.component("Chart", Chart);
  vueApp.component("DataTable", DataTable);
  vueApp.component("Column", Column);

  vueApp.directive("tooltip", Tooltip);
});
