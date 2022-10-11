<script lang="ts">
import { defineComponent } from "vue";
import UserTopArtists from "./UserTopArtists.vue";
import UserTopTracks from "./UserTopTracks.vue";
import TopGenres from "./top-genres/TopGenres.vue";
import TopGenresSkeleton from "./top-genres/TopGenresSkeleton.vue";
import ActivityCard from "./ActivityCard.vue";

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
  <main class="app-main">
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
.app-main {
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
