<script lang="ts">
import { defineComponent } from "vue";
import UserTopArtists from "./UserTopArtists.vue";
import UserTopTracks from "./UserTopTracks.vue";
import TopGenres from "./top-genres/TopGenres.vue";

export default defineComponent({
  components: { UserTopArtists, UserTopTracks, TopGenres },
});
</script>

<template>
  <main class="app-main">
    <Suspense>
      <TopGenres />
    </Suspense>

    <UserTopArtists />
    <UserTopTracks />
  </main>
</template>

<style scoped>
.app-main {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  flex-direction: column;
  gap: 4.8rem;
}

.profile-section {
  grid-column: span 2;
}
</style>
