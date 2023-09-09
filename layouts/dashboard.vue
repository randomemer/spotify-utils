<template>
  <v-layout>
    <TheAppSidebar />
    <TheAppbar />
    <v-main>
      <slot></slot>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import useAuthStore from "~/store/auth.store";

const { $spotify } = useNuxtApp();
const authStore = useAuthStore();

$spotify.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${authStore.token?.access_token}`;
  return config;
});
</script>
