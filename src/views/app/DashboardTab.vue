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
// import { delay } from "@/utilities/functions";
import SpotifyWebApi from "spotify-web-api-js";
import { defineAsyncComponent, h, inject } from "vue";

const spotify = new SpotifyWebApi();
const $appTokens = inject<AppTokens>("$tokens");
const token = sessionStorage.getItem("access_token") as string;
spotify.setAccessToken(token);

if (!$appTokens) {
  console.log("no access token mate");
}

const AsyncGenresCard = defineAsyncComponent({
  loadingComponent: TopGenresSkeleton,
  loader: async () => {
    // const tokens = await $appTokens?.tokens;

    const genres = await getTopGenres(token);
    if (!genres) {
      throw Error("Couldn't get top genres");
    }

    return () => h(TopGenres, { genres });
  },
});

const AsyncActivityCard = defineAsyncComponent({
  loadingComponent: ActivityCardSkeleton,
  errorComponent: () => h("div"),
  loader: async () => {
    // const tokens = await $appTokens?.tokens;

    // spotify.setAccessToken(tokens.access_token);
    const history = await spotify.getMyRecentlyPlayedTracks({
      limit: 50,
    });

    return () => h(ActivityCard, { history });
  },
});

const AsyncTopTracksCard = defineAsyncComponent({
  loadingComponent: TopTracksSkeleton,
  errorComponent: () => h("div"),
  loader: async () => {
    // const tokens = await $appTokens?.tokens;

    // spotify.setAccessToken(tokens.access_token);
    const tracks = await spotify.getMyTopTracks();

    return () => h(TopTracks, { tracks });
  },
});

const AsyncTopArtistsCard = defineAsyncComponent({
  loadingComponent: TopArtistsSkeleton,
  errorComponent: () => h("div"),
  loader: async () => {
    // const tokens = await $appTokens?.tokens;

    // spotify.setAccessToken(tokens.access_token);
    const artists = await spotify.getMyTopArtists();

    return () => h(TopArtists, { artists });
  },
});

// let key = ref(46313);
// setInterval(() => {
//   key.value++;
//   console.log("key updated");
// }, 5000);
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
