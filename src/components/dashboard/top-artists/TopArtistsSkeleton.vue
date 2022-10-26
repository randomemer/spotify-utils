<script setup lang="ts">
import TrackItemSkeleton from "@/components/track/TrackItemSkeleton.vue";
</script>

<template>
  <div class="card">
    <div class="card-title-row">
      <h3 class="heading-tertiary">Your Top Artists</h3>
    </div>

    <div class="artist-list">
      <TrackItemSkeleton v-for="(_, i) in Array(5)" :key="i" />
    </div>
  </div>
</template>

<style scoped>
@import "./top-artists.css";
</style>
