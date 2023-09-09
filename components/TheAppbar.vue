<template>
  <v-app-bar>
    <v-avatar :image="pfp"></v-avatar>
  </v-app-bar>
</template>

<script setup lang="ts">
const { $spotify } = useNuxtApp();

const { data: profile, error } = useAsyncData(async (ctx) => {
  const resp = await $spotify.get<SpotifyApi.CurrentUsersProfileResponse>(
    "/me"
  );
  return resp.data;
});

const pfp = computed(() => profile.value?.images?.at(-1)?.url);
</script>
