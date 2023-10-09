<template>
  <AuthLoader />
</template>

<script setup lang="ts">
import useUserStore from "~/store/user.store";

const { $api } = useNuxtApp();
const authStore = useUserStore();

useAsyncData(
  async (ctx) => {
    const resp = await $api.get<LoginResp>("/auth/login");

    switch (resp.data.status) {
      case "redirect":
        window.location.href = resp.data.url;
        break;

      case "success":
        authStore.setToken(resp.data.payload);
        await ctx?.$router.replace("/app/dashboard");
        break;

      default:
        throw new Error("Something went wrong");
        break;
    }
  },
  { server: false }
);
</script>
