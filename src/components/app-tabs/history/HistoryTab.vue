<script setup lang="ts">
import HistoryTable from "./HistoryTable.vue";
</script>

<template>
  <main>
    <h2 class="heading-secondary">Listening History</h2>

    <Suspense>
      <HistoryTable />
    </Suspense>
  </main>
</template>

<style scoped>
.heading-secondary {
  margin-bottom: 4.8rem;
}
</style>
