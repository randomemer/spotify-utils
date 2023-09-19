<template>
  <v-navigation-drawer
    class="sidebar"
    location="left"
    :temporary="isTemporary"
    :model-value="isOpen"
  >
    <template #prepend>
      <div class="header-content">
        <img class="logo" src="~/assets/logo.svg" alt="music muse logo" />
        <p class="logo-title text-h6 font-weight-medium">Music Muse</p>
      </div>
    </template>

    <template #default>
      <v-list nav density="compact" class="pa-0">
        <v-list-item
          nav
          color="primary"
          :active="$route.name?.toString().startsWith(link.route)"
          :key="link.route"
          :value="link.route"
          v-for="link in links"
          class="nav-link"
          @click="onRouteClicked(link.route)"
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
const router = useRouter();

const links = [
  {
    icon: "view-grid",
    label: "Dashboard",
    route: "app:dashboard",
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

function onRouteClicked(route: string) {
  router.push({ name: route });
}
</script>

<style scoped>
.sidebar {
  padding-inline: 0;
}

.header-content {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  justify-content: center;

  .logo {
    height: 2rem;
    width: 2rem;
  }
}
</style>

<style lang="scss">
.v-navigation-drawer__prepend {
  padding: 2rem 1rem;
}

.v-navigation-drawer__content {
  padding: 1rem;

  .nav-link {
    .v-list-item__spacer {
      width: 0.75rem !important;
    }
  }
}
</style>
