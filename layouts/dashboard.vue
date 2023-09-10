<template>
  <div>
    <TheAppSidebar />
    <TheAppbar />
    <v-main>
      <div class="main-content">
        <slot></slot>
      </div>
    </v-main>
  </div>
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

<style scoped lang="scss">
.main-content {
  padding: 4rem 3rem;
}
</style>
