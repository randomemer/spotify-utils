import "~/assets/css/main.scss";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      themes: {
        light: {
          dark: true,
          colors: {
            primary: "#730099",
            background: "#191414",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
