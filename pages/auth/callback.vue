<template>
  <div class="container">
    <v-card>
      <div class="card-content">
        <v-progress-circular indeterminate color="primary" />
        <p class="text-body1 font-weight-regular text-center">Hang tight!</p>
        <p class="text-body1 font-weight-regular text-center">
          You will be redirected in a couple of seconds
        </p>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { callWithNuxt } from "nuxt/app";
import useAuthStore from "~/store/auth.store";

const nuxtApp = useNuxtApp();
const route = useRoute();
const env = useRuntimeConfig();
const authStore = useAuthStore();
const event = useRequestEvent();

onServerPrefetch(async () => {
  try {
    const { createSession } = await import("~/server/utils/session");

    // 1. Fetch tokens
    const encoded = Buffer.from(
      `${env.spotifyClientId}:${env.spotifyClientSecret}`
    ).toString("base64");

    const formData = new URLSearchParams({
      grant_type: "authorization_code",
      code: `${route.query.code?.toString()}`,
      redirect_uri: `${nuxtApp._appConfig.origin}/auth/callback`,
    });

    const tokenResp = await axios.post<AccessTokenResponse>(
      `https://accounts.spotify.com/api/token`,
      formData.toString(),
      {
        headers: {
          Authorization: `Basic ${encoded}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // 2. Create a new session and save tokens to data store
    await createSession(event, env as any, tokenResp.data);
    const expiry = Date.now() + tokenResp.data.expires_in * 1000;
    authStore.setToken({
      access_token: tokenResp.data.access_token,
      expiry,
    });
    await callWithNuxt(nuxtApp, navigateTo, ["/app", { replace: true }]);
  } catch (error) {
    console.error(error);
    await callWithNuxt(nuxtApp, navigateTo, ["/500", { replace: true }]);
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
