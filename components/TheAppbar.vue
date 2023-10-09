<template>
  <v-app-bar>
    <template #title>
      {{ getRouteTitle() }}
    </template>
    <template #append>
      <v-btn icon variant="text" color="primary">
        <v-avatar :image="pfp" />
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import useUserStore from "~/store/user.store";
import { NAV_LINKS } from "~/utils/constants";

const route = useRoute();
const { $spotify } = useNuxtApp();
const userStore = useUserStore();

const { data: profile, error } = useAsyncData(async () => {
  return await userStore.fetchSpotifyProfile($spotify);
});

const pfp = computed(() => profile.value?.images?.at(-1)?.url);

const getRouteTitle = () =>
  NAV_LINKS.find((link) => String(route.name).startsWith(link.route))?.label;
</script>

<style scoped lang="scss"></style>
