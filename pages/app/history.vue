<template>
  <NuxtLayout name="dashboard" :key="$route.name?.toString()">
    <DataTable :value="history?.items" :loading="pending">
      <Column header="#">
        <template #body="{ index }"> {{ index + 1 }} </template>
      </Column>
      <Column header="Track">
        <template #body="{ data }">
          <TrackItem :track="data.track" />
        </template>
      </Column>
      <Column header="Popularity">
        <template #body="{ data }">{{ data.track.id }}</template>
      </Column>
      <Column header="Played At" field="played_at">
        <template #body="{ data }">{{ data.played_at }}</template>
      </Column>
    </DataTable>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ name: "app:history", middleware: "auth" });

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
  console.log("resp", resp.data);
  return resp.data;
});

watch(error, () => {
  console.log(error);
});
</script>
