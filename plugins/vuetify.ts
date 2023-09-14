import { createVuetify } from "vuetify";
import {
  VBtn,
  VLayout,
  VAppBar,
  VNavigationDrawer,
  VList,
  VListItem,
  VAvatar,
  VIcon,
  VMain,
} from "vuetify/components";

export default defineNuxtPlugin({
  parallel: true,
  setup: (nuxtApp) => {
    const vuetify = createVuetify({
      ssr: true,
      theme: {
        defaultTheme: "musicMuseDark",
        themes: {
          musicMuseDark: {
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
      components: {
        VBtn,
        VLayout,
        VAppBar,
        VNavigationDrawer,
        VList,
        VListItem,
        VAvatar,
        VIcon,
        VMain,
      },
    });

    nuxtApp.vueApp.use(vuetify);
  },
});
