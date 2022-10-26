<script setup lang="ts">
import TrackItemSkeleton from "@/components/track/TrackItemSkeleton.vue";
</script>

<template>
  <div class="card">
    <div class="card-title-row">
      <h3 class="heading-tertiary">Your Top Tracks</h3>
    </div>

    <div class="track-list">
      <TrackItemSkeleton v-for="(_, i) in Array(5)" :key="i" />
      <!-- <div class="track-list-item"></div> -->
    </div>
  </div>
</template>

<style scoped>
@import "./top-tracks.css";
</style>
