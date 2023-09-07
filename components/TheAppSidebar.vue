<template>
  <v-navigation-drawer
    permanent
    location="left"
    class="sidebar"
    v-model="isOpen"
  >
    <div class="drawer-content">
      <p class="text-h5 text-center">Music Muse</p>
      <v-list nav density="compact">
        <v-list-item
          :active="$route.path === link.route"
          v-for="link in links"
          :key="link.route"
          :value="link.route"
          color="primary"
        >
          <div class="nav-item">
            <IonIcon
              :icon="
                $route.path === link.route
                  ? link.icon.filled
                  : link.icon.outline
              "
            />
            <span class="text-body-1">{{ link.name }}</span>
          </div>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import {
  grid,
  gridOutline,
  personCircle,
  personCircleOutline,
  time,
  timeOutline,
  search,
  searchOutline,
  list,
  listOutline,
} from "ionicons/icons";

const links = [
  {
    icon: {
      outline: gridOutline,
      filled: grid,
    },
    name: "Dashboard",
    route: "/app",
  },
  {
    icon: {
      outline: personCircleOutline,
      filled: personCircle,
    },
    name: "Account",
    route: "/app/account",
  },
  {
    icon: {
      outline: timeOutline,
      filled: time,
    },
    name: "History",

    route: "/app/history",
  },
  {
    icon: {
      outline: searchOutline,
      filled: search,
    },
    name: "Recommendations",
    route: "/app/recommends",
  },
  {
    icon: {
      outline: listOutline,
      filled: list,
    },
    name: "Playlists",
    route: "/app/playlists",
  },
];

const isOpen = ref(true);
</script>

<style scoped lang="scss">
.drawer-content {
  width: 17rem;
  display: flex;
  gap: 4.8rem;
  flex-direction: column;
  padding: 1.5rem;
}

.nav-item {
  display: flex;
  gap: 0.75rem;
  align-items: center;

  ion-icon {
    font-size: 1.5rem;
  }
}
</style>
