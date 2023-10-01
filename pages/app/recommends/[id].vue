<template>
  <NuxtLayout>
    <div class="grid">
      <v-list class="rounded">
        <TrackItem
          :key="track.id"
          v-for="track in data?.data.tracks"
          class=""
          :track="track"
        />
      </v-list>

      <SeedsCard v-if="data" :seeds="data.data.seeds" />
    </div>

    <SpeedDial class="fabs">
      <template #fab>
        <v-btn
          color="secondary"
          size="large"
          variant="elevated"
          icon="mdi-share-variant"
        />
      </template>
      <template #actions>
        <v-btn color="secondary" variant="elevated" icon="mdi-content-save" />
      </template>
    </SpeedDial>
  </NuxtLayout>
</template>

<script setup lang="ts">
import useCacheStore from "~/store/cache.store";

definePageMeta({
  name: "app:recommends:id",
  layout: "dashboard",
  middleware: "auth",
});

useHead({ title: "Recommends | Music Muse" });

const route = useRoute();
const { $api } = useNuxtApp();
const cache = useCacheStore();

const { data, error } = useAsyncData(async () => {
  const id = route.params.id as string;

  const cached = cache.getCachedRecommend(id);
  if (cached) return cached;

  const resp = await $api.get<RecommendsDataFull>(`/recommends/${id}`);
  console.log("from backend", resp.data);
  return resp.data;
});

console.log(error.value);

watchEffect(() => {
  // console.log("data", data.value);
  console.log("err", error.value);
});
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  gap: 3rem;
  grid-template-columns: 3fr 2fr;
}

:deep(.seeds-card) {
  position: sticky;
  align-self: flex-start;
  top: calc(var(--v-layout-top) + 2rem);
}

.fabs {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
}
</style>
