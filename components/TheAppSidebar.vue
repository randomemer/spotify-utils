<template>
  <v-navigation-drawer class="nav-drawer" permanent location="left">
    <p class="text-h5 text-center">Music Muse</p>
    <v-list tag="ul" nav density="compact">
      <v-list-item
        v-for="link in links"
        :key="link.route"
        :value="link.route"
        tag="li"
      >
        {{ link.name }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const links = [
  {
    name: "Dashboard",
    route: "/app/dashboard",
  },
  {
    name: "Account",
    route: "/app/account",
  },
  {
    name: "History",
    route: "/app/history",
  },
  {
    name: "Recommendations",
    route: "/app/recommends",
  },
  {
    name: "Playlists",
    route: "/app/playlists",
  },
];
</script>

<style scoped lang="scss">
.nav-drawer .v-navigation-drawer__content {
  padding: 1.5rem;
}
</style>
