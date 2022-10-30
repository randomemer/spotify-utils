import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AuthView from "@/views/AuthView.vue";
import { refreshAccessToken } from "@/utilities/functions";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    // Smooth scrolling for sections of page
    if (to.hash) {
      const element = document.querySelector(to.hash);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scroll({ behavior: "smooth", top: 0 });
    }
  },
  routes: [
    {
      path: "/",
      name: "home",
      alias: "/home",
      component: HomeView,
    },
    {
      path: "/auth",
      name: "auth",
      component: AuthView,
    },
    {
      path: "/app",
      name: "app",
      component: () => import("@/views/AppView.vue"),
      async beforeEnter(to) {
        // If no user is logged in
        const user = localStorage.getItem("current_user");
        if (!user) {
          return {
            path: "/auth",
          };
        }

        const tokens = await refreshAccessToken(user);
        setInterval(() => {}, tokens.expires_in);

        // default route : dashboard
        if (to.path === "/app") {
          return {
            path: "/app/dashboard",
          };
        }
      },
      children: [
        {
          path: "dashboard",
          component: () => import("@/views/app/DashboardTab.vue"),
        },
        {
          path: "history",
          component: () => import("@/views/app/HistoryTab.vue"),
        },
        {
          path: "recommends",
          component: () => {
            return import("@/views/app/RecommendsTab.vue");
          },
        },
        {
          path: "recommends/:id",
          component: () =>
            import("@/components/recommends/GeneratedRecommends.vue"),
        },
        {
          path: "logout",
          redirect() {
            window.$cookies.remove("current_user");
            return { path: "/home" };
          },
        },
      ],
    },
  ],
});

export default router;
