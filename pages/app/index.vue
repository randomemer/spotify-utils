<template>
  <NuxtLayout name="dashboard">
    <div class="cards-grid">
      <DashboardTopGenres />
      <DashboardAudioFeatures />
      <DashboardTopTracks />
      <DashboardTopArtists />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ name: "app", middleware: "auth", alias: ["/app/dashboard"] });

import DashboardTopGenres from "~/components/dashboard/TopGenres.vue";
import DashboardTopTracks from "~/components/dashboard/TopTracks.vue";
import DashboardTopArtists from "~/components/dashboard/TopArtists.vue";
import DashboardAudioFeatures from "~/components/dashboard/AudioFeatures.vue";

onMounted(() => {
  import("chart.js").then((res) => {
    res.defaults.font.family = `"Lexend", sans-serif`;
  });
});
</script>

<style scoped lang="scss">
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 50fr);
  flex-direction: column;
  gap: 3rem;
}
</style>
