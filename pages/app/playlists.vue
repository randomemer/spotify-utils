<template>
  <NuxtLayout name="dashboard">
    <form @submit="onPlaylistSubmit($event)">
      <v-text-field
        clearable
        type="url"
        v-model="url"
        variant="solo-filled"
        prepend-inner-icon="mdi-link"
        placeholder="Gimme a playlist link"
        :error="inputStatus === `error`"
        :loading="inputStatus === `pending`"
        :disabled="[`success`, `pending`].includes(inputStatus)"
        :messages="inputMessage"
      />
    </form>
  </NuxtLayout>
</template>

<script setup lang="ts">
import useAuthStore from "~/store/auth.store";

definePageMeta({ name: "app:playlists", middleware: "auth" });

useHead({ title: "Playlists | Music Muse" });

const { $api, $spotify } = useNuxtApp();
const authStore = useAuthStore();

const url = ref("");
const inputStatus = ref("idle");
const inputMessage = ref("");
const playlist = ref<SpotifyApi.PlaylistObjectFull | null>(null);

const analysisStatus = ref("");
const analysis = ref<PlaylistAnalysisResponse | null>(null);

async function onPlaylistSubmit(event: Event) {
  event.preventDefault();
  inputStatus.value = "pending";
  try {
    const id = extractPlaylistId(url.value);

    const resp = await $spotify.get<SpotifyApi.SinglePlaylistResponse>(
      `/playlists/${id}`
    );

    playlist.value = resp.data;
    inputStatus.value = "success";
    inputMessage.value = "Playlist found!";
  } catch (error) {
    if (!(error instanceof Error)) return;

    if (error instanceof TypeError) {
      inputMessage.value = "Invalid link";
    } else {
      inputMessage.value = error.message;
    }
    inputStatus.value = "error";
    console.error(inputMessage.value);
  }
}

watchEffect(() => {
  if (inputStatus.value !== "success") return;

  getPlaylistAnalysis();
});

async function getPlaylistAnalysis() {
  console.time("pl");
  analysisStatus.value = "pending";
  try {
    const list = playlist.value!;
    const query = new URLSearchParams({
      snapshot_id: list.snapshot_id,
    });

    const resp = await $api.get<PlaylistAnalysisResponse>(
      `/api/playlist/${list.id}?${query}`,
      {
        headers: { Authorization: `Bearer ${authStore.token?.access_token}` },
      }
    );

    console.log(resp.data);
    analysis.value = resp.data;
    analysisStatus.value = "success";
  } catch (error) {
    console.error(error);
    analysisStatus.value = "error";
  }
  console.timeEnd("pl");
}
</script>
