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
        <v-chip-group filter v-model="filter">
          <v-chip
            v-for="item in SPOTIFY_SEARCH_FILTERS"
            color="primary"
            size="large"
            :key="item.value"
            :text="item.label"
            :value="item.value"
          />
        </v-chip-group>
      </div>
      <v-card class="seeds-card">
        <v-card-title>Selected Seeds</v-card-title>
        <v-card-text>
          <v-list v-if="seeds.length > 0"> </v-list>
          <div v-else class="empty-seeds">
            <v-icon icon="mdi-music-note" />
            <span>No seeds. Add upto 5 seeds</span>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  name: "app:recommends",
  middleware: "auth",
  layout: "dashboard",
});

useHead({ title: "Recommends | Music Muse" });

const { $spotify } = useNuxtApp();

const q = ref<string>("");
const filter = ref<string>();
const seeds = ref<SpotifySearchSeed[]>([]);

const {
  data: results,
  status,
  refresh: search,
} = useAsyncData(
  async () => {
    if (!q.value) return;
    const query = new URLSearchParams({
      q: q.value,
      type: filter.value ?? "track,artist",
    });
    const resp = await $spotify.get<SpotifyApi.SearchResponse>(
      `/search?${query}`
    );

    return resp.data;
  },
  { server: false, immediate: false, lazy: true, watch: [filter] }
);

function onSearch(event: Event) {
  event.preventDefault();
  if (status.value === `pending`) return;
  search();
}

watchEffect(() => {
  console.log(results.value);
});

watchEffect(() => {
  console.log(filter.value);
});
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  gap: 3rem;
  grid-template-columns: 3fr 2fr;
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
</style>
