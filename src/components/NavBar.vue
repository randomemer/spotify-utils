<script lang="ts">
import { defineComponent } from "vue";
import { IonIcon } from "@ionic/vue";
import * as ionicons from "ionicons/icons";
import ProfileCard from "./profile-card/ProfileCard.vue";

export default defineComponent({
  setup() {
    return { IonIcon };
  },
  data() {
    return {
      appNavItems: [
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
            outline: ionicons.constructOutline,
            filled: ionicons.construct,
          },
          name: "Utilities",
          route: "/app/utilities",
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
    };
  },
  components: { ProfileCard },
});
</script>

<template>
  <nav class="nav-sidebar">
    <span class="logo-title">Spotify Utilities</span>

    <ProfileCard />

    <ul class="nav-links">
      <li v-for="(value, _, i) in appNavItems" :key="i">
        <router-link
          class="nav-link"
          :to="value.route"
          :class="{
            'nav-link--active': $router.currentRoute.value.path === value.route,
          }"
        >
          <ion-icon
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
  </nav>
</template>

<style scoped>
.nav-sidebar {
  width: 15%;
  height: 100%;
  padding: 2.4rem;
  background-color: rgba(255, 255, 255, 0.1);

  display: flex;
  gap: 4.8rem;
  flex-direction: column;
  align-items: center;
}

.nav-sidebar * {
  transition: all 0.1s;
}

.logo-title {
  font-size: 3rem;
}

.nav-links {
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  list-style: none;
  gap: 3.6rem;
}

.nav-link {
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  font-size: 1.8rem;
  color: #bbbbbb;

  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link--active {
  color: #1db954;
}
</style>
