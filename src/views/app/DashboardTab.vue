<script setup lang="ts">
import { defineAsyncComponent, h, type PropType } from "vue";
import UserTopArtists from "@/components/dashboard/top-artists/UserTopArtists.vue";
import UserTopTracks from "@/components/dashboard/top-tracks/UserTopTracks.vue";
import TopGenres from "@/components/dashboard/top-genres/TopGenres.vue";
import TopGenresSkeleton from "@/components/dashboard/top-genres/TopGenresSkeleton.vue";
import ActivityCard from "@/components/dashboard/activity/ActivityCard.vue";
import ActivityCardSkeleton from "@/components/dashboard/activity/ActivityCardSkeleton.vue";
import SpotifyWebApi from "spotify-web-api-js";

const token = window.$cookies.get("access_token");
const spotify = new SpotifyWebApi();
spotify.setAccessToken(token);

const props = defineProps({
  fetchedUser: { type: Object as PropType<Promise<any>>, required: true },
});

const AsyncActivityCard = defineAsyncComponent({
  loadingComponent: ActivityCardSkeleton,
  loader: async () => {
    await props.fetchedUser;
    const history = await spotify.getMyRecentlyPlayedTracks({
      limit: 50,
    });
    return () => h(ActivityCard, { history });
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

    <AsyncActivityCard />

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
