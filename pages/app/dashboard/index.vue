<template>
  <!-- Extra div for fixing page transition errors bug -->
  <!-- https://github.com/nuxt/nuxt/issues/13309 -->
  <div>
    <NuxtLayout>
      <div class="cards-grid">
        <DashboardTopGenres />
        <DashboardAudioFeatures />
        <DashboardTopTracks />
        <DashboardTopArtists />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import DashboardTopGenres from "~/components/dashboard/TopGenres.vue";
import DashboardTopTracks from "~/components/dashboard/TopTracks.vue";
import DashboardTopArtists from "~/components/dashboard/TopArtists.vue";
import DashboardAudioFeatures from "~/components/dashboard/AudioFeatures.vue";

definePageMeta({
  name: "app:dashboard",
  middleware: "auth",
  alias: ["/app"],
  layout: "dashboard",
});
useHead({ title: "Dashboard | Music Muse" });
</script>

<style scoped lang="scss">
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 50fr);
  flex-direction: column;
  gap: 3rem;
}
</style>
