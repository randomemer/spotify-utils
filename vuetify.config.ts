import { defineVuetifyConfiguration } from "vuetify-nuxt-module/custom-configuration";

export default defineVuetifyConfiguration({
  theme: {
    defaultTheme: "musicMuseTheme",
    themes: {
      musicMuseTheme: {
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
