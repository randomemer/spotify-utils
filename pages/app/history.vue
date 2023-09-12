<template>
  <NuxtLayout name="dashboard" :key="$route.name?.toString()">
    <DataTable class="history-table" :value="history?.items" :loading="pending">
      <Column header="#">
        <template #body="{ index }"> {{ index + 1 }} </template>
      </Column>
      <Column header="Track">
        <template #body="{ data }">
          <TrackItem :track="data.track" />
        </template>
      </Column>
      <Column header="Popularity">
        <template #body="{ data }">
          <PopularityIcon class="pop-icon" :value="data.track?.popularity" />
        </template>
      </Column>
      <Column header="Played At" field="played_at">
        <template #body="{ data }">
          <div class="timestamp">
            <span>
              {{ dayjs(data.played_at, { utc: true }).format("hh:mm:ss A") }}
            </span>
            <span>
              {{ dayjs(data.played_at, { utc: true }).format("MM-DD-YYYY") }}
            </span>
          </div>
        </template>
      </Column>
    </DataTable>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ name: "app:history", middleware: "auth" });

import dayjs from "dayjs";

const { $spotify } = useNuxtApp();

const {
  data: history,
  error,
  pending,
} = useAsyncData(async () => {
  const query = new URLSearchParams({
    limit: "50",
  });
  const resp = await $spotify.get<SpotifyApi.UsersRecentlyPlayedTracksResponse>(
    `/me/player/recently-played?${query}`
  );
  console.log("resp", resp.data.items.at(0));
  return resp.data;
});

watch(error, () => {
  console.log(error);
});
</script>

<style scoped lang="scss">
.history-table {
  overflow: clip;
}

.pop-icon {
  :deep(.ionicon) {
    font-size: 1.5rem;
  }
}

.timestamp {
  span {
    display: block;
    line-height: 1.5;
  }
}
</style>
