<template>
  <v-card class="pa-6">
    <div class="d-flex justify-space-between">
      <h3 class="text-h5">Your Top Tracks</h3>
      <v-select
        hide-details
        color="primary"
        variant="solo-filled"
        density="compact"
        v-model="timeRange"
        :items="timeRangeItems"
        item-title="label"
        item-value="value"
        menu-icon="chevronDown"
        class="flex-grow-0 flex-shrink-0"
      >
      </v-select>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { SpotifyTimeRange } from "~/types";
import { IonIcon } from "@ionic/vue";
import { chevronDown } from "ionicons/icons";

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
