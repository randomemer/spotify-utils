<script setup lang="ts">
import HistoryTable, {
  checkNextPage,
} from "@/components/history/HistoryTable.vue";
import HistoryTableSkeleton from "@/components/history/HistoryTableSkeleton.vue";
import SpotifyWebApi from "spotify-web-api-js";
import { defineAsyncComponent, h } from "vue";

const spotify = new SpotifyWebApi();
const token = sessionStorage.getItem("access_token");
spotify.setAccessToken(token);

const AsyncHistoryTable = defineAsyncComponent({
  loadingComponent: HistoryTableSkeleton,
  loader: async () => {
    const recentTracks =
      (await spotify.getMyRecentlyPlayedTracks()) as RecentlyPlayedTracks;
    const hasNext = await checkNextPage(recentTracks, spotify);
    return () => h(HistoryTable, { recentTracks, propHasNext: hasNext });
  },
});
</script>

<template>
  <main>
    <h2 class="heading-secondary">Listening History</h2>

    <AsyncHistoryTable />
  </main>
</template>

<style scoped>
.heading-secondary {
  margin-bottom: 4.8rem;
}
</style>
