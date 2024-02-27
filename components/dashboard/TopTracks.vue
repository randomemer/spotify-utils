<template>
  <v-card>
    <v-card-title :class="$style.card_title">
      <h3 class="text-h5 font-weight-bold">Your Top Tracks</h3>
      <v-select
        hide-details
        v-model="timeRange"
        color="primary"
        density="compact"
        item-title="label"
        item-value="value"
        variant="solo-filled"
        :class="$style.time_range_select"
        :items="TIME_RANGE_ITEMS"
      />
    </v-card-title>

    <v-card-text :class="$style.card_content">
      <TrackItem
        :key="track.id"
        v-for="track in tracks?.items.slice(0, 5)"
        :track="track"
      />
    </v-card-text>

    <v-card-actions class="justify-end pa-4">
      <v-btn
        variant="tonal"
        color="primary"
        append-icon="mdi-chevron-right"
        @click="onViewMore()"
      >
        View More
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { SpotifyTimeRange } from "~/types";

const { $spotify, $router } = useNuxtApp();
const timeRange = ref(SpotifyTimeRange.ShortTerm);

const { data: tracks, error } = useAsyncData(
  async () => {
    const query = new URLSearchParams({ time_range: timeRange.value });
    const resp = await $spotify.get<SpotifyApi.UsersTopTracksResponse>(
      `/me/top/tracks?${query}`
    );
    return resp.data;
  },
  { watch: [timeRange], server: false }
);

function onViewMore() {
  $router.push("/app/dashboard/top-tracks");
}
</script>

<style module lang="scss">
.card_title {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}

.card_content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.time_range_select {
  flex: unset;
}
</style>
