<template>
  <Card class="card">
    <template #title>
      <h3>Your Top Tracks</h3>
      <Dropdown
        v-model="timeRange"
        option-label="label"
        option-value="value"
        :options="timeRangeItems"
        class="time-range-select"
      />
    </template>

    <template #content>
      <TrackItem
        :key="track.id"
        v-for="track in tracks?.items.slice(0, 5)"
        :track="track"
      />
    </template>

    <template #footer>
      <v-btn variant="tonal" color="primary" append-icon="mdi-chevron-right">
        View More
      </v-btn>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { SpotifyTimeRange } from "~/types";

const { $spotify } = useNuxtApp();
const timeRange = ref(SpotifyTimeRange.ShortTerm);

const { data: tracks, error } = useAsyncData(
  async () => {
    const query = new URLSearchParams({ time_range: timeRange.value });
    const resp = await $spotify.get<SpotifyApi.UsersTopTracksResponse>(
      `/me/top/tracks?${query}`
    );
    return resp.data;
  },
  { watch: [timeRange] }
);

const timeRangeItems = [
  { label: "All Time", value: SpotifyTimeRange.LongTerm },
  { label: "Medium Term", value: SpotifyTimeRange.MediumTerm },
  { label: "Short Term", value: SpotifyTimeRange.ShortTerm },
];
</script>

<style scoped lang="scss">
.card {
  :deep(.p-card-title) {
    display: flex;
    justify-content: space-between;

    h3 {
      font-size: inherit;
      line-height: 1.5;
    }
  }

  :deep(.p-card-content) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  :deep(.p-card-footer) {
    display: flex;
    justify-content: flex-end;
  }
}

.view-more {
  text-transform: uppercase;
}
</style>
