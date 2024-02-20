<template>
  <v-app-bar>
    <template #title>
      {{ getRouteTitle() }}
    </template>
    <template #append>
      <v-btn icon variant="text" color="primary">
        <v-avatar size="36" :image="pfp" />
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import useUserStore from "~/store/user.store";
import { NAV_LINKS } from "~/utils/constants";

const route = useRoute();
const userStore = useUserStore();

const pfp = computed(() => userStore.profile?.picture ?? undefined);

const getRouteTitle = () =>
  NAV_LINKS.find((link) => String(route.name).startsWith(link.route))?.label;
</script>

<style scoped lang="scss"></style>
