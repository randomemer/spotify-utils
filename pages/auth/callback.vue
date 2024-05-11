<template>
  <AuthLoader />
</template>

<script setup lang="ts">
import { callWithNuxt } from "nuxt/app";
import useUserStore from "~/store/user.store";

const nuxtApp = useNuxtApp();
const route = useRoute();
const authStore = useUserStore();
const event = useRequestEvent();

onServerPrefetch(async () => {
  try {
    const code = route.query.code?.toString();
    if (!code) {
      throw createError({
        statusCode: 400,
        statusMessage: "Code not provided in query parameters",
      });
    }

    const query = new URLSearchParams({ code });
    const resp = await nuxtApp.$api.get<UserSession>(`/auth/session?${query}`);

    // Forward set cookie headers from above post request
    event?.node.res.setHeader("Set-Cookie", resp.headers["set-cookie"]!);
    authStore.setSession(resp.data);

    await callWithNuxt(nuxtApp, navigateTo, [
      "/app/dashboard",
      { replace: true },
    ]);
  } catch (error) {
    console.error(error);
    throw createError({
      fatal: true,
      statusCode: 500,
      statusMessage: "Something went wrong :(",
    });
  }
});
</script>

<style scoped lang="scss">
.container {
  position: fixed;
  display: flex;
  height: 100%;
  width: 100%;

  align-items: center;
  justify-content: center;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 25rem;
  height: 16rem;
  padding: 3rem;
  align-items: center;
  justify-content: center;
}
</style>
