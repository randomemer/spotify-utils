import PrimeVue from "primevue/config";

// Components
import Card from "primevue/card";
import ProgressSpinner from "primevue/progressspinner";
import Sidebar from "primevue/sidebar";
import Menu from "primevue/menu";
import Listbox from "primevue/listbox";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";

export default defineNuxtPlugin((nuxtApp) => {
  const { vueApp } = nuxtApp;
  vueApp.use(PrimeVue, { ripple: true });

  vueApp.component("Card", Card);
  vueApp.component("ProgressSpinner", ProgressSpinner);
  vueApp.component("Sidebar", Sidebar);
  vueApp.component("Menu", Menu);
  vueApp.component("Listbox", Listbox);
  vueApp.component("Button", Button);
  vueApp.component("Avatar", Avatar);
  vueApp.component("Dropdown", Dropdown);
});
