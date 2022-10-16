<script setup lang="ts">
import HistoryTable from "@/components/history/HistoryTable.vue";
import HistoryTableSkeleton from "@/components/history/HistoryTableSkeleton.vue";
</script>

<template>
  <main>
    <h2 class="heading-secondary">Listening History</h2>

    <Suspense>
      <template #default>
        <HistoryTable />
      </template>
      <template #fallback>
        <HistoryTableSkeleton />
      </template>
    </Suspense>
  </main>
</template>

<style scoped>
.heading-secondary {
  margin-bottom: 4.8rem;
}
</style>
