import "~/assets/css/main.scss";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      themes: {
        light: {
          dark: true,
          colors: {
            primary: "#BA68C8",
            secondary: "#3F51B5",
            background: "#191414",
            info: "#2196F3",
            error: "#FF5722",
            success: "#4CAF50",
            warning: "#FFC107",
            "on-primary": "#bf00ff",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
