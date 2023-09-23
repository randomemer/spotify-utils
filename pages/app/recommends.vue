<template>
  <NuxtLayout>
    <div class="grid">
      <div class="search-pane">
        <form @submit="onSearch($event)">
          <v-text-field
            clearable
            variant="solo-filled"
            color="primary"
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            :loading="status === `pending`"
            v-model="q"
          />
        </form>
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

        <v-list>
          <template :key="i" v-for="(item, i) in results">
            <TrackItem v-if="item.type === `track`" :track="item">
              <template #append>
                <v-btn
                  density="comfortable"
                  variant="tonal"
                  icon="mdi-plus"
                  color="primary"
                  @click="addSeed(item)"
                  :disabled="seeds.has(item.id) || seeds.size === 5"
                />
              </template>
            </TrackItem>

            <ArtistItem v-if="item.type === `artist`" :artist="item">
              <template #append>
                <v-btn
                  density="comfortable"
                  variant="tonal"
                  icon="mdi-plus"
                  color="primary"
                  @click="addSeed(item)"
                  :disabled="seeds.has(item.id) || seeds.size === 5"
                />
              </template>
            </ArtistItem>

            <GenreItem v-if="item.type === `genre`" :genre="item" />
          </template>
        </v-list>
      </div>

      <v-card class="seeds-card">
        <v-card-title>Selected Seeds</v-card-title>
        <v-card-text>
          <v-list v-if="seeds.size > 0">
            <template :key="i" v-for="(item, i) in seeds.values()">
              <TrackItem v-if="item.type === `track`" :track="item">
                <template #append>
                  <v-btn
                    density="comfortable"
                    variant="tonal"
                    icon="mdi-minus"
                    color="primary"
                    @click="removeSeed(item.id)"
                  />
                </template>
              </TrackItem>

              <ArtistItem v-if="item.type === `artist`" :artist="item">
                <template #append>
                  <v-btn
                    density="comfortable"
                    variant="tonal"
                    icon="mdi-minus"
                    color="primary"
                    @click="removeSeed(item.id)"
                  />
                </template>
              </ArtistItem>

              <GenreItem
                v-if="item.type === `genre`"
                :genre="item"
              /> </template
          ></v-list>
          <div v-else class="empty-seeds">
            <v-icon icon="mdi-music-note" />
            <span>No seeds. Add upto 5 seeds</span>
          </div>
        </v-card-text>
        <v-card-actions class="seeds-actions">
          <v-btn
            :disabled="seeds.size === 0"
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

definePageMeta({
  name: "app:recommends",
  middleware: "auth",
  layout: "dashboard",
});

useHead({ title: "Recommends | Music Muse" });

const { $spotify } = useNuxtApp();

const miniSearch = new MiniSearch<GenreObject>({
  fields: ["genre"],
  storeFields: ["genre"],
  searchOptions: { fuzzy: 0.5, boost: { genre: 2 } },
});

const q = ref<string>("");
const filter = ref<"track" | "artist" | "genre">("track");
const page = ref(1);

const seeds = ref<Map<string, SearchResult>>(new Map());
const results = ref<SearchResult[]>([]);

const { data: allGenres } = useAsyncData(
  async () => {
    const resp = await $spotify.get<SpotifyApi.AvailableGenreSeedsResponse>(
      "/recommendations/available-genre-seeds"
    );
    const genreDocs = resp.data.genres.map<GenreObject>((genre, i) => ({
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
    if (!q.value) return null;
    if (filter.value === "genre") return null;

    const query = new URLSearchParams({
      q: q.value,
      type: filter.value,
      limit: `${PAGE_LIMIT}`,
      offset: `${(page.value - 1) * PAGE_LIMIT}`,
    });
    const resp = await $spotify.get<SpotifyApi.SearchResponse>(
      `/search?${query}`
    );

    const searchResp = resp.data[`${filter.value}s`];
    results.value = searchResp!.items;
  },
  { server: false, immediate: false, lazy: true, watch: [page, filter] }
);

watchEffect(() => {
  miniSearch.removeAll();
  miniSearch.addAll(allGenres.value);
});

watchEffect(() => {
  if (filter.value !== "genre") return;
  if (q.value === "") {
    results.value = allGenres.value;
  }
});

function onSearch(event: Event) {
  event.preventDefault();
  if (status.value === `pending`) return;
  searchSpotify();
}

function searchGenres() {
  const res = miniSearch.search(q.value);
  const mapepdRes = res.map((resItem) => {
    return allGenres.value.find((genre) => genre.id === resItem.id)!;
  });
  results.value = mapepdRes;
}

function addSeed(seed: SearchResult) {
  if (seeds.value.has(seed.id) || seeds.value.size === 5) return;
  seeds.value.set(seed.id, seed);
}

function removeSeed(id: string) {
  seeds.value.delete(id);
}

async function generate() {
  try {
  } catch (error) {}
}
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  gap: 3rem;
  grid-template-columns: 3fr 2fr;
}

.seeds-card {
  align-self: flex-start;
  position: sticky;
  top: 0;
  height: auto;

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
