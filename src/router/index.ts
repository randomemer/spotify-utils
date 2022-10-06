import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AuthView from "../views/AuthView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    // Change title of the page accordingly
    // document.title = to.name;

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
      component: () => import("../views/AppView.vue"),
      children: [
        {
          path: "dashboard",
          component: () => import("../components/app-tabs/DashboardTab.vue"),
        },
        {
          path: "utilities",
          component: () => import("../components/app-tabs/DashboardTab.vue"),
        },
        {
          path: "logout",
          component: () => import("../components/app-tabs/DashboardTab.vue"),
        },
      ],
    },
  ],
});

export default router;
