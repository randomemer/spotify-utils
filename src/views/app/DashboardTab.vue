<script lang="ts">
import { defineComponent } from "vue";
import UserTopArtists from "@/components/dashboard/UserTopArtists.vue";
import UserTopTracks from "@/components/dashboard/UserTopTracks.vue";
import TopGenres from "@/components/dashboard/top-genres/TopGenres.vue";
import TopGenresSkeleton from "@/components/dashboard/top-genres/TopGenresSkeleton.vue";
import ActivityCard from "@/components/dashboard/ActivityCard.vue";

export default defineComponent({
  components: {
    UserTopArtists,
    UserTopTracks,
    TopGenres,
    TopGenresSkeleton,
    ActivityCard,
  },
});
</script>

<template>
  <main class="dashboard">
    <!-- First Row -->
    <Suspense>
      <template #default>
        <TopGenres />
      </template>
      <template #fallback>
        <TopGenresSkeleton />
      </template>
    </Suspense>
    <Suspense>
      <template #default>
        <ActivityCard />
      </template>
    </Suspense>

    <!-- Second Row -->
    <UserTopArtists />
    <UserTopTracks />
  </main>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: repeat(2, 50fr);
  flex-direction: column;
  gap: 4.8rem;
}

.card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 2.4rem;
}
</style>
