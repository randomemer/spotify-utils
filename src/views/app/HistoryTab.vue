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
  <div>
    <AsyncHistoryTable />
  </div>
</template>

<style scoped lang="scss"></style>
