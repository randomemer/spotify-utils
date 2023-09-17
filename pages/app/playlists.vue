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
        v-on:update:model-value="onUpdateInput"
      />
    </form>

    <v-slide-x-transition>
      <div v-show="analysisStatus === `pending`" class="loader">
        <div class="loader-content">
          <v-progress-circular indeterminate color="primary" />
          <p>Analyzing your playlist</p>
        </div>
      </div>
    </v-slide-x-transition>

    <template v-if="analysisStatus === `success` && analysis && playlist">
      <div class="cards-grid">
        <div class="grid-col">
          <v-card class="name-card">
            <img
              class="thumbnail"
              :src="playlist.images.at(0)?.url"
              alt="Playlist Image"
            />
            <div>
              <v-card-title>{{ playlist.name }}</v-card-title>
              <v-card-text v-html="playlist.description" />
            </div>
          </v-card>
          <v-card class="info-card">
            <div class="info-row">
              <span class="text-h6">{{ avgDuration }}</span>
              <span class="text">Avg track duration</span>
            </div>
            <div class="info-row">
              <span class="text-h6">
                {{ analysis.analysis.avg_popularity.toFixed(2) }} %
              </span>
              <span class="text">Avg popularity</span>
            </div>
          </v-card>
        </div>
        <v-card class="grid-col">
          <v-card-title>Genres</v-card-title>
          <GenresChart :genres="analysis.analysis.genres.counts" />
        </v-card>
        <v-card class="grid-col">
          <v-card-title>Audio Features</v-card-title>
          <FeaturesChart :features="analysis.analysis.audio_features" />
        </v-card>
      </div>

      <v-table class="rounded">
        <thead>
          <tr>
            <th>#</th>
            <th>Artist</th>
            <th>Tracks</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="artist.id" v-for="(artist, i) in analysis.artists">
            <td>{{ i + 1 }}</td>
            <td><ArtistItem :artist="artist" /></td>
            <td>{{ analysis.analysis.artists.counts[artist.id] }}</td>
          </tr>
        </tbody>
      </v-table>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import useAuthStore from "~/store/auth.store";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import GenresChart from "~/components/GenresChart.vue";

definePageMeta({ name: "app:playlists", middleware: "auth" });

useHead({ title: "Playlists | Music Muse" });

dayjs.extend(duration);

const { $api, $spotify } = useNuxtApp();
const authStore = useAuthStore();

const url = ref("");
const inputStatus = ref("idle");
const inputMessage = ref("");
const playlist = ref<SpotifyApi.PlaylistObjectFull | null>(null);

const analysisStatus = ref("");
const analysis = ref<PlaylistAnalysisResponse | null>(null);

const avgDuration = computed(() => {
  const ms = analysis.value?.analysis.avg_track_length;
  if (!ms) return "";

  return dayjs.duration(ms).format(`m [min] s [s]`);
});

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

function onUpdateInput() {
  inputMessage.value = "";
  inputStatus.value = "idle";
}

watchEffect(() => {
  if (inputStatus.value !== "success") return;

  getPlaylistAnalysis();
});

async function getPlaylistAnalysis() {
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

    analysis.value = resp.data;
    analysisStatus.value = "success";
  } catch (error) {
    console.error(error);
    analysisStatus.value = "error";
  }
}
</script>

<style scoped lang="scss">
form {
  margin-bottom: 3rem;
}

.cards-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 4rem;

  .grid-col:first-of-type {
    display: flex;
    flex-direction: column;
    gap: inherit;
  }
}

.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 27rem;

  .loader-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
}

.name-card {
  display: flex;

  .thumbnail {
    max-height: 100%;
    width: 7rem;
  }
}

.info-card {
  padding: 1rem;

  .info-row {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    .text {
      color: var(--text-secondary);
    }
  }
}

td {
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
}
</style>
