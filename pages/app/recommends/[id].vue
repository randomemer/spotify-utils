<template>
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

  <v-speed-dial
    :open-on-hover="true"
    content-class="fabs"
    location="top center"
    transition="fab-transition"
  >
    <template #activator="{ props: activatorProps }">
      <div class="fabs">
        <v-btn
          color="secondary"
          variant="elevated"
          icon="mdi-content-save"
          @click="isSaveOpen = true"
        />
        <v-btn
          v-bind="activatorProps"
          color="secondary"
          variant="elevated"
          icon="mdi-share-variant"
        />
      </div>
    </template>

    <v-btn
      :key="1"
      size="small"
      color="secondary"
      variant="elevated"
      icon="mdi-facebook"
    />
    <v-btn
      :key="2"
      size="small"
      color="secondary"
      variant="elevated"
      icon="mdi-twitter"
    />
  </v-speed-dial>

  <SavePlaylistDialog
    v-model="isSaveOpen"
    default-desc="My recommendations from Music Muse"
    :tracks="data?.data.tracks ?? []"
  />
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
const nuxtApp = useNuxtApp();
const { $api } = nuxtApp;
const cache = useCacheStore();
const isSaveOpen = ref(false);

const { data, error } = useAsyncData(async () => {
  const id = route.params.id as string;

  const cached = cache.getCachedRecommend(id);
  if (cached) return cached;

  const resp = await $api.get<RecommendsDataFull>(`/recommends/${id}`);
  return resp.data;
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

  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;
}
</style>
