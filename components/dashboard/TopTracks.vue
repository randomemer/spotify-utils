<template>
  <Card>
    <template #title>
      <p>Your Top Tracks</p>
      <Dropdown
        v-model="timeRange"
        option-label="label"
        option-value="value"
        :options="timeRangeItems"
        class="time-range-select"
      />
    </template>

    <template #content> </template>
  </Card>
</template>

<script setup lang="ts">
import { SpotifyTimeRange } from "~/types";

const { $spotify } = useNuxtApp();
const timeRange = ref(SpotifyTimeRange.ShortTerm);

const { data: genres, error } = useAsyncData(
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
