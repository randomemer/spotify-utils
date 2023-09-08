<template>
  <AuthLoader />
</template>

<script setup lang="ts">
import useAuthStore from "~/store/auth.store";

const { $api } = useNuxtApp();
const authStore = useAuthStore();

useAsyncData(
  async (ctx) => {
    const resp = await $api.get<LoginResp>("/api/auth/login");

    switch (resp.data.status) {
      case "redirect":
        window.location.href = resp.data.url;
        break;

      case "success":
        authStore.setToken(resp.data.payload);
        await ctx?.$router.replace("/app");
        break;

      default:
        break;
    }
  },
  { server: false }
);
</script>
