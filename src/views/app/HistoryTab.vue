<script setup lang="ts">
import HistoryTable, {
  checkNextPage,
} from "@/components/history/HistoryTable.vue";
import HistoryTableSkeleton from "@/components/history/HistoryTableSkeleton.vue";
import { spotify } from "@/utilities/spotify-api";
import { defineAsyncComponent, h } from "vue";

const AsyncHistoryTable = defineAsyncComponent({
  loadingComponent: HistoryTableSkeleton,
  loader: async () => {
    const propsHistory =
      (await spotify.getMyRecentlyPlayedTracks()) as RecentlyPlayedTracks;
    const hasNext = await checkNextPage(propsHistory);
    return () => h(HistoryTable, { propsHistory, propHasNext: hasNext });
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
