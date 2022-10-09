<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import { IonIcon } from "@ionic/vue";
import * as ionicons from "ionicons/icons";
import ProfileCardSkeleton from "./profile-card/ProfileCardSkeleton.vue";

export default defineComponent({
  data() {
    return {
      appNavItems: [
        {
          sectionName: "Main",
          links: [
            {
              icon: {
                outline: ionicons.gridOutline,
                filled: ionicons.grid,
              },
              name: "Dashboard",
              route: "/app/dashboard",
            },
            {
              icon: {
                outline: ionicons.logOutOutline,
                filled: ionicons.logOut,
              },
              name: "Logout",
              route: "/app/logout",
            },
          ],
        },
        {
          sectionName: "Insights",
          links: [
            {
              icon: {
                outline: ionicons.timeOutline,
                filled: ionicons.time,
              },
              name: "History",
              route: "/app/history",
            },
          ],
        },
      ],
    };
  },
  components: {
    IonIcon,
    ProfileCardSkeleton,
    ProfileCard: defineAsyncComponent(
      () => import("./profile-card/ProfileCard.vue")
    ),
  },
});
</script>

<template>
  <aside class="sidebar">
    <span class="logo-title">Spotify Utilities</span>

    <!-- Profile Card -->
    <Suspense>
      <template #default>
        <ProfileCard />
      </template>
      <template #fallback>
        <ProfileCardSkeleton></ProfileCardSkeleton>
      </template>
    </Suspense>

    <!-- Tabs area -->
    <nav class="nav-links-area">
      <div class="link-section" v-for="(section, _, i) in appNavItems" :key="i">
        <span class="link-section-name">{{ section.sectionName }}</span>
        <ul class="nav-links">
          <li v-for="(value, _, i) in section.links" :key="i">
            <router-link
              class="nav-link"
              :to="value.route"
              :class="{
                'nav-link--active':
                  $router.currentRoute.value.path === value.route,
              }"
            >
              <ion-icon
                class="route-icon"
                :icon="
                  $router.currentRoute.value.path === value.route
                    ? value.icon.filled
                    : value.icon.outline
                "
              />
              <span>{{ value.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.logo-title {
  font-size: 3rem;
  text-align: center;
}

.sidebar {
  height: 100%;
  padding: 2.4rem;
  background-color: rgba(255, 255, 255, 0.1);

  display: flex;
  gap: 4.8rem;
  flex-direction: column;
  align-items: center;
}

.sidebar * {
  transition: all 0.1s;
}

.nav-links-area {
  display: flex;
  align-self: stretch;
  flex-direction: column;
  gap: 3rem;
}

.link-section {
  display: flex;
  flex-direction: column;
}

.link-section-name {
  text-transform: uppercase;
  font-size: 1.4rem;
  color: #bbb;
  margin-bottom: 1.8rem;
}

.nav-links {
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  list-style: none;
  gap: 1.6rem;
  margin-left: 1.6rem;
}

.nav-link {
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  font-size: 1.6rem;
  color: white;

  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link--active {
  color: #1db954;
}

.route-icon {
  font-size: 2.2rem;
}
</style>
