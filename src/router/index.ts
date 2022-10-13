import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AuthView from "@/views/AuthView.vue";
import AppView from "@/views/AppView.vue";

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
      component: AppView,
      children: [
        {
          path: "",
          redirect() {
            console.log("redirected");
            return {
              path: "app/dashboard",
            };
          },
        },
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
          component: () => import("@/views/app/RecommendsTab.vue"),
        },
        {
          path: "logout",
          redirect() {
            return { path: "home" };
          },
        },
      ],
    },
  ],
});

export default router;
