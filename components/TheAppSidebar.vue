<template>
  <Sidebar
    position="left"
    :modal="isTemporary"
    :dismissable="isTemporary"
    :show-close-icon="isTemporary"
    :visible="isOpen"
    :pt="{
      root: { class: $style.sidebar },
      header: { class: $style['sidebar-header'] },
    }"
  >
    <template #header>
      <p :class="$style.title">Music Muse</p>
    </template>

    <template #default>
      <Listbox
        option-value="url"
        :options="links"
        :class="$style['nav-list']"
        :model-value="$route.path"
        :pt="{ item: { class: $style['nav-list-item'] } }"
      >
        <template #option="{ option }">
          <NuxtLink :class="$style['nav-link']" :to="option.url">
            <IonIcon
              :class="$style['nav-link-icon']"
              :icon="
                $route.path === option.url
                  ? option.icon.filled
                  : option.icon.outline
              "
            />
            <span>{{ option.label }}</span>
          </NuxtLink>
        </template>
      </Listbox>
    </template>
  </Sidebar>
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

const isTemporary = ref(false);

const links = [
  {
    icon: {
      outline: gridOutline,
      filled: grid,
    },
    url: "/app",
    label: "Dashboard",
  },
  {
    icon: {
      outline: personCircleOutline,
      filled: personCircle,
    },
    label: "Account",
    url: "/app/account",
  },
  {
    icon: {
      outline: timeOutline,
      filled: time,
    },
    label: "History",
    url: "/app/history",
  },
  {
    icon: {
      outline: searchOutline,
      filled: search,
    },
    label: "Recommendations",
    url: "/app/recommends",
  },
  {
    icon: {
      outline: listOutline,
      filled: list,
    },
    label: "Playlists",
    url: "/app/playlists",
  },
];

const isOpen = ref(true);
</script>

<style module lang="scss">
.sidebar {
  width: 17.5rem !important;
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
