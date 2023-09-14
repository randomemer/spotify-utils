<template>
  <v-navigation-drawer
    location="left"
    :temporary="isTemporary"
    :model-value="isOpen"
  >
    <template #prepend>
      <p>Music Muse</p>
    </template>

    <template #default>
      <v-list nav density="compact">
        <v-list-item
          nav
          nuxt
          color="primary"
          :active="$route.name === link.route"
          :key="link.route"
          :value="link.route"
          v-for="link in links"
        >
          <template #prepend>
            <v-icon :icon="`mdi-` + link.icon" />
          </template>
          <template #default>{{ link.label }}</template>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const isOpen = ref(true);
const isTemporary = ref(false);

const links = [
  {
    icon: "view-grid",
    label: "Dashboard",
    route: "app",
  },
  {
    icon: "account-circle",
    label: "Account",
    route: "app:account",
  },
  {
    icon: "clock",
    label: "History",
    route: "app:history",
  },
  {
    icon: "magnify",
    label: "Recommends",
    route: "app:recommends",
  },
  {
    icon: "playlist-music",
    label: "Playlists",
    route: "app:playlists",
  },
];
</script>
