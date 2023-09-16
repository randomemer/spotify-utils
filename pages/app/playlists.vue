<template>
  <NuxtLayout name="dashboard">
    <form @submit="onPlaylistSubmit($event)">
      <v-text-field
        clearable
        type="url"
        variant="solo-filled"
        prepend-inner-icon="mdi-link"
        placeholder="Gimme a playlist link"
        v-model="url"
      />
    </form>
  </NuxtLayout>
</template>

<script setup lang="ts">
import useAuthStore from "~/store/auth.store";

definePageMeta({ name: "app:playlists", middleware: "auth" });

useHead({ title: "Playlists | Music Muse" });

const { $api } = useNuxtApp();
const authStore = useAuthStore();

const url = ref("");
const status = ref("idle");
const message = ref("");

function onPlaylistSubmit(event: Event) {
  event.preventDefault();
  try {
    const id = extractPlaylistId(url.value);
    console.log(id);

    getPlaylistAnalysis(id);
  } catch (error) {
    if (!(error instanceof Error)) return;

    if (error instanceof TypeError) {
      message.value = "Invalid link";
    } else {
      message.value = error.message;
    }
    console.error(message.value);
  }
}

async function getPlaylistAnalysis(id: string) {
  console.time("pl");
  try {
    const resp = await $api.get("/api/playlist/" + id, {
      headers: { Authorization: `Bearer ${authStore.token?.access_token}` },
    });

    console.log(resp.data);
  } catch (error) {
    console.error(error);
  }
  console.timeEnd("pl");
}
</script>
