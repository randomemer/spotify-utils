<template>
  <NuxtLayout>
    <div class="grid">
      <div class="search-pane">
        <form @submit="onSearch($event)">
          <v-text-field
            clearable
            color="primary"
            placeholder="Search"
            density="comfortable"
            variant="solo-filled"
            prepend-inner-icon="mdi-magnify"
            :loading="status === `pending`"
            v-model="q"
          />
          <v-chip-group filter mandatory v-model="filter" class="chips">
            <v-chip
              v-for="item in SPOTIFY_SEARCH_FILTERS"
              color="primary"
              size="large"
              :key="item.value"
              :text="item.label"
              :value="item.value"
            />
          </v-chip-group>
        </form>

        <template v-if="filter === `genre` || status === `success`">
          <v-list
            class="results-list"
            bg-color="transparent"
            v-if="results.length > 0"
          >
            <div :key="item.id" class="result-item" v-for="item in results">
              <TrackItem v-if="item.type === `track`" :track="item" />
              <ArtistItem v-else-if="item.type === `artist`" :artist="item" />
              <GenreItem v-else-if="item.type === `genre`" :genre="item" />

              <v-btn
                density="comfortable"
                variant="tonal"
                icon="mdi-plus"
                color="primary"
                @click="addSeed(item)"
                :disabled="seeds.has(item.id) || seeds.size === 5"
              />
            </div>
          </v-list>
          <v-card v-else> Nothing :9 </v-card>
        </template>
      </div>

      <v-card class="seeds-card">
        <v-card-title>Selected Seeds</v-card-title>
        <v-card-text>
          <v-list class="results-list" v-if="seeds.size > 0">
            <div
              class="result-item"
              :key="item.id"
              v-for="item in seeds.values()"
            >
              <TrackItem v-if="item.type === `track`" :track="item" />
              <ArtistItem v-else-if="item.type === `artist`" :artist="item" />
              <GenreItem v-else-if="item.type === `genre`" :genre="item" />

              <v-btn
                density="comfortable"
                variant="tonal"
                icon="mdi-minus"
                color="primary"
                @click="removeSeed(item.id)"
              />
            </div>
          </v-list>
          <div v-else class="empty-seeds">
            <v-icon icon="mdi-music-note" />
            <span>No seeds. Add upto 5 seeds</span>
          </div>
        </v-card-text>
        <v-card-actions class="seeds-actions">
          <v-btn
            :disabled="seeds.size === 0"
            :loading="feedPending"
            variant="elevated"
            color="primary"
            @click="generate()"
          >
            Generate
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import MiniSearch from "minisearch";
import _ from "lodash";
import useAuthStore from "~/store/auth.store";
import useCacheStore from "~/store/cache.store";

definePageMeta({
  name: "app:recommends",
  middleware: "auth",
  layout: "dashboard",
});

useHead({ title: "Recommends | Music Muse" });

const miniSearch = new MiniSearch<GenreObject>({
  fields: ["genre"],
  storeFields: ["genre"],
  searchOptions: { fuzzy: 0.5, boost: { genre: 2 } },
});

// Global composables
const cache = useCacheStore();
const authStore = useAuthStore();
const { $spotify, $api } = useNuxtApp();

// State
const q = ref<string | null>("");
const filter = ref<SeedSearchResult["type"]>("track");

const seeds = ref<Map<string, SeedSearchResult>>(new Map());
const results = ref<SeedSearchResult[]>([]);
const feedPending = ref(false);

const { data: allGenres } = useAsyncData(
  async () => {
    const resp = await $spotify.get<SpotifyApi.AvailableGenreSeedsResponse>(
      "/recommendations/available-genre-seeds"
    );
    const genreDocs = resp.data.genres.map<GenreObject>((genre) => ({
      id: genre,
      type: "genre",
      genre,
    }));

    return genreDocs;
  },
  {
    default: () => [] as GenreObject[],
  }
);

const { status, refresh: searchSpotify } = useAsyncData(
  async () => {
    const query = new URLSearchParams({
      q: q.value!,
      type: filter.value,
      limit: `${PAGE_LIMIT}`,
      offset: `${results.value.length}`,
    });
    const resp = await $spotify.get<SpotifyApi.SearchResponse>(
      `/search?${query}`
    );

    if (filter.value === "genre") return null; // Only for ts type inference
    const searchResp = resp.data[`${filter.value}s`];
    results.value = searchResp!.items;
  },
  { server: false, immediate: false, lazy: true }
);

onMounted(() => {
  filter.value = "track";
});

watch(allGenres, () => {
  miniSearch.removeAll();
  miniSearch.addAll(allGenres.value);
});

watch([filter], () => {
  results.value = [];

  switch (filter.value) {
    case "genre":
      if (!q.value?.trim()) {
        results.value = allGenres.value;
      } else {
        searchGenres();
      }
      break;

    case "artist":
    case "track":
      if (!q.value?.trim()) return null;
      searchSpotify();
      break;

    default:
      break;
  }
});

function onSearch(event: Event) {
  event.preventDefault();
  if (status.value === `pending`) return;
  if (!q.value?.trim()) return;

  if (filter.value !== "genre") {
    searchSpotify();
  } else {
    searchGenres();
  }
}

async function searchGenres() {
  const res = miniSearch.search(q.value!);
  const mappedRes = res.map((resItem) => {
    return allGenres.value.find((genre) => genre.id === resItem.id)!;
  });
  results.value = mappedRes;
}

function addSeed(seed: SeedSearchResult) {
  if (seeds.value.has(seed.id) || seeds.value.size === 5) return;
  seeds.value.set(seed.id, seed);
}

function removeSeed(id: string) {
  seeds.value.delete(id);
}

async function generate() {
  feedPending.value = true;
  try {
    const [trackSeeds, artistSeeds, genreSeeds] = [[], [], []] as string[][];
    seeds.value.forEach((val, id) => {
      if (val.type === "track") trackSeeds.push(id);
      else if (val.type === "artist") artistSeeds.push(id);
      else genreSeeds.push(id);
    });

    const qObj = _.pickBy({
      seed_tracks: trackSeeds.join(","),
      seed_genres: genreSeeds.join(","),
      seed_artists: artistSeeds.join(","),
      limit: "100",
    });
    const query = new URLSearchParams(qObj);
    const resp = await $api.get<RecommendsDataFull>(`/recommends?${query}`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    });

    // Cache to pinia store to avoid network calls again in next route
    cache.cacheRecommendData(resp.data);

    await navigateTo(`/app/recommends/${resp.data.id}`);
  } catch (error) {
    console.error(error);
  }
  feedPending.value = false;
}
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  gap: 3rem;
  grid-template-columns: 3fr 2fr;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;

  :deep(.v-list-item) {
    padding: 0;
  }
}

.search-pane {
  form {
    z-index: 4;
    position: sticky;
    top: calc(var(--v-layout-top));
    padding-top: 2rem;
    margin-top: -2rem;
    background-color: rgb(var(--v-theme-background));
  }
}

.seeds-card {
  align-self: flex-start;
  position: sticky;
  top: calc(var(--v-layout-top) + 2rem);

  :deep(.v-card-text) {
    padding-bottom: 0;
  }

  .seeds-actions {
    padding: 1rem;

    :deep(.v-btn) {
      width: 100%;
    }
  }
}

.empty-seeds {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 0;
  gap: 1.5rem;

  .v-icon {
    font-size: 3rem;
  }
}

.chips {
  margin-bottom: 1.5rem;
}
</style>
