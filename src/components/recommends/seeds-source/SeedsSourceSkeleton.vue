<script setup lang="ts">
import TrackItemSkeleton from "../../track/TrackItemSkeleton.vue";
</script>

<template>
  <div>
    <h3>Generated From</h3>
    <ul class="seeds-list">
      <li v-for="(_, i) in Array(3)" :key="i"><TrackItemSkeleton /></li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@import "./seeds-source.scss";
</style>
