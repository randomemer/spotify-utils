<script setup lang="ts">
import ActivityCard from "@/components/dashboard/activity/ActivityCard.vue";
import ActivityCardSkeleton from "@/components/dashboard/activity/ActivityCardSkeleton.vue";
import TopArtists from "@/components/dashboard/top-artists/TopArtists.vue";
import TopArtistsSkeleton from "@/components/dashboard/top-artists/TopArtistsSkeleton.vue";
import TopGenres, {
  getTopGenres,
} from "@/components/dashboard/top-genres/TopGenres.vue";
import TopGenresSkeleton from "@/components/dashboard/top-genres/TopGenresSkeleton.vue";
import TopTracks from "@/components/dashboard/top-tracks/TopTracks.vue";
import TopTracksSkeleton from "@/components/dashboard/top-tracks/TopTracksSkeleton.vue";
import { db } from "@/main";
import { doc, getDoc } from "@firebase/firestore";
import type SpotifyWebApi from "spotify-web-api-js";
import { defineAsyncComponent, h, inject } from "vue";

const $spotify = inject<SpotifyWebApi.SpotifyWebApiJs>("$spotify");
if (!$spotify) {
  throw new Error("no-spotify-api-instance");
}

const AsyncGenresCard = defineAsyncComponent({
  loadingComponent: TopGenresSkeleton,
  loader: async () => {
    const genres = await getTopGenres();
    return () => h(TopGenres, { genres });
  },
});

const AsyncActivityCard = defineAsyncComponent({
  loadingComponent: ActivityCardSkeleton,
  errorComponent: () => h("div"),
  loader: async () => {
    const account = localStorage.getItem("current_user");
    const acc: Account = JSON.parse(account);

    const docRef = doc(db, "users", acc.user.id);
    const history = await getDoc(docRef);

    console.log(history);

    return () => h(ActivityCard, { history });
  },
});

const AsyncTopTracksCard = defineAsyncComponent({
  loadingComponent: TopTracksSkeleton,
  errorComponent: () => h("div"),
  loader: async () => {
    const tracks = await $spotify.getMyTopTracks();
    return () => h(TopTracks, { tracks });
  },
});

const AsyncTopArtistsCard = defineAsyncComponent({
  loadingComponent: TopArtistsSkeleton,
  errorComponent: () => h("div"),
  loader: async () => {
    const artists = await $spotify.getMyTopArtists();
    return () => h(TopArtists, { artists });
  },
});
</script>

<template>
  <main class="dashboard">
    <!-- First Row -->
    <AsyncGenresCard />
    <AsyncActivityCard />

    <!-- Second Row -->
    <AsyncTopArtistsCard />
    <AsyncTopTracksCard />
  </main>
</template>

<style scoped lang="scss">
.dashboard {
  display: grid;
  grid-template-columns: repeat(2, 50fr);
  flex-direction: column;
  gap: 4.8rem;
}
</style>
