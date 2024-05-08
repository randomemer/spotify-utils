<template>
  <div>
    <NuxtLayout name="dashboard">
      <form @submit="onPlaylistSubmit($event)">
        <v-text-field
          clearable
          type="url"
          v-model="url"
          variant="solo-filled"
          density="comfortable"
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
              <div class="content">
                <v-card-title class="text-h5 font-weight-bold">
                  {{ playlist.name }}
                </v-card-title>
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
              <v-tooltip
                :text="dTooltipText"
                max-width="320px"
                open-delay="300"
              >
                <template #activator="{ props: activatorProps }">
                  <div v-bind="activatorProps" class="info-row">
                    <span class="text-h6">
                      {{ analysis.analysis.artists.diversity_index.toFixed(3) }}
                    </span>
                    <span class="text">Artists diversity index</span>
                  </div>
                </template>
              </v-tooltip>
              <v-tooltip
                :text="dTooltipText"
                max-width="320px"
                open-delay="300"
              >
                <template #activator="{ props: activatorProps }">
                  <div v-bind="activatorProps" class="info-row">
                    <span class="text-h6">
                      {{ analysis.analysis.genres.diversity_index.toFixed(3) }}
                    </span>
                    <span class="text">Genres diversity index</span>
                  </div>
                </template>
              </v-tooltip>
            </v-card>
          </div>

          <v-card class="grid-col">
            <v-card-title>Genres</v-card-title>
            <v-card-text>
              <GenresChart
                :genres="analysis.analysis.genres.counts"
                :chart-options="pieChartOptions"
              />
            </v-card-text>
          </v-card>

          <v-card class="grid-col">
            <v-card-title>Audio Features</v-card-title>
            <v-card-text>
              <FeaturesChart
                :features="analysis.analysis.audio_features"
                :chart-options="radarChartOptions"
              />
            </v-card-text>
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
            <tr :key="artist.id" v-for="(artist, i) in sortedArtists">
              <td>{{ i + 1 }}</td>
              <td><ArtistItem :artist="artist" /></td>
              <td>{{ analysis.analysis.artists.counts[artist.id] }}</td>
            </tr>
          </tbody>
        </v-table>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { ChartOptions } from "chart.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import _ from "lodash";
import GenresChart from "~/components/GenresChart.vue";
import type { InsertPlaylist } from "~/server/database/schema";
import useUserStore from "~/store/user.store";

definePageMeta({ name: "app:playlists", middleware: "auth" });

useHead({ title: "Playlists | Music Muse" });

dayjs.extend(duration);

const { $api, $spotify } = useNuxtApp();
const authStore = useUserStore();

const url = ref("");
const inputStatus = ref("idle");
const inputMessage = ref("");
const playlist = ref<SpotifyApi.PlaylistObjectFull | null>(null);

const analysisStatus = ref("");
const analysis = ref<InsertPlaylist | null>(null);

const avgDuration = computed(() => {
  const ms = analysis.value?.analysis.avg_track_length;
  if (!ms) return "";

  return dayjs.duration(ms).format(`m [min] s [s]`);
});

const sortedArtists = computed(() => {
  const data = analysis.value;
  if (!data) return [];
  return _.sortBy(data.artists, (a) => -data.analysis.artists.counts[a.id]);
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

    const resp = await $api.get<InsertPlaylist>(
      `/playlist/${list.id}?${query}`,
      {
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      }
    );

    analysis.value = resp.data;
    analysisStatus.value = "success";
  } catch (error) {
    console.error(error);
    analysisStatus.value = "error";
  }
}

const radarChartOptions: ChartOptions<"radar"> = {
  scales: {
    r: {
      pointLabels: {
        display: false,
      },
    },
  },
};

const pieChartOptions: ChartOptions<"pie"> = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

const dTooltipText = `Simpson's diversity index : represents the probability
that two individuals randomly selected from a sample will belong to
different categories.`;
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

  :deep(.chart) {
    height: 17.5rem !important;
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
  flex: 1;
  position: relative;

  .thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    object-fit: cover;
    z-index: 0;
  }

  .content {
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba($color: #000000, $alpha: 0.5);
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
