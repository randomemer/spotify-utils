<template>
  <v-navigation-drawer
    location="left"
    :temporary="isTemporary"
    :model-value="isOpen"
  >
    <template #prepend>
      <p :class="$style.title">Music Muse</p>
    </template>

    <template #default>
      <v-list nav density="compact">
        <v-list-item
          nav
          color="primary"
          :active="$route.name === link.route"
          :key="link.route"
          :value="link.route"
          v-for="link in links"
          :to="link.route"
          nuxt
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

<style module lang="scss">
.sidebar {
  width: var(--sidebar-width) !important;
}

.title {
  font-size: 1.5rem;
}

.sidebar-header {
  justify-content: center !important;
}

.nav-list {
  width: 100% !important;
  border: none !important;
  border-radius: 0 !important;
  background-color: transparent !important;
  margin-top: 3rem;
}

.nav-list-item {
  padding: 0.5rem 1rem !important;
  border-radius: 3px !important;
}

.nav-link {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.nav-link-icon {
  font-size: 1.25rem;
}
</style>
