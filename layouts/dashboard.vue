<template>
  <div id="app-container">
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

console.log(useRoute().matched);
</script>

<style lang="scss">
:root {
  --app-bar-height: 4rem;
  --sidebar-height: 17.5rem;
}

#app-container {
  padding-left: var(--sidebar-height);
  padding-top: var(--app-bar-height);
}

.main-content {
  padding: 4rem 3rem;
}
</style>
