<script setup lang="ts">
import { defineAsyncComponent, h, type PropType } from "vue";
import { IonIcon } from "@ionic/vue";
import * as ionicons from "ionicons/icons";
import ProfileCard from "@/components/profile-card/ProfileCard.vue";
import ProfileCardSkeleton from "@/components/profile-card/ProfileCardSkeleton.vue";
import SpotifyWebApi from "spotify-web-api-js";
import { useRouter } from "vue-router";

const token = window.$cookies.get("access_token");
const spotify = new SpotifyWebApi();
spotify.setAccessToken(token);

const $router = useRouter();

const $props = defineProps({
  fetchedUser: { type: Object as PropType<Promise<any>>, required: true },
});

const AsyncProfileCard = defineAsyncComponent({
  loadingComponent: ProfileCardSkeleton,
  loader: async () => {
    await $props.fetchedUser;
    const user = await spotify.getMe();
    return () => h(ProfileCard, { user });
  },
});

const appNavItems = [
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
    sectionName: "Utilities",
    links: [
      {
        icon: {
          outline: ionicons.timeOutline,
          filled: ionicons.time,
        },
        name: "History",
        route: "/app/history",
      },
      {
        icon: {
          outline: ionicons.searchOutline,
          filled: ionicons.search,
        },
        name: "Recommendations",
        route: "/app/recommends",
      },
    ],
  },
];

function isActiveLink(route: string): boolean {
  return $router.currentRoute.value.path.includes(route);
}
</script>

<template>
  <aside class="sidebar">
    <span class="logo-title">Spotify Utilities</span>

    <!-- Profile Card -->
    <AsyncProfileCard />

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
                'nav-link--active': isActiveLink(value.route),
              }"
            >
              <ion-icon
                class="route-icon"
                :icon="
                  isActiveLink(value.route)
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
@import "@/assets/general.css";

.logo-title {
  font-size: 3rem;
  text-align: center;
}

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;

  padding: 2.4rem;
  background-color: rgba(255, 255, 255, 0.1);

  display: flex;
  gap: 4.8rem;
  flex-direction: column;
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
  /* color: var(--primary-color); */
  color: var(--primary-font-color);
}

.route-icon {
  font-size: 2.2rem;
}
</style>
