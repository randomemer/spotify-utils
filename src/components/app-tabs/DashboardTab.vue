<script lang="ts">
import { defineComponent } from "vue";
import UserTopArtists from "../../components/UserTopArtists.vue";
import UserTopTracks from "../../components/UserTopTracks.vue";

export default defineComponent({
  components: { UserTopArtists, UserTopTracks },
});
</script>

<template>
  <main class="app-main">
    <!-- <UserProfileCard class="profile-section" /> -->

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
