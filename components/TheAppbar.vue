<template>
  <v-app-bar>
    <template v-slot:append>
      <v-btn :icon="pfp">
        <v-avatar color="surface-variant" :image="pfp"></v-avatar>
      </v-btn>
    </template>
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
