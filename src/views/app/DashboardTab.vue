<script setup lang="ts">
import ActivityCard from "@/components/dashboard/activity/ActivityCard.vue";
import ActivityCardSkeleton from "@/components/dashboard/activity/ActivityCardSkeleton.vue";
import TopArtists from "@/components/dashboard/top-artists/TopArtists.vue";
import TopArtistsSkeleton from "@/components/dashboard/top-artists/TopArtistsSkeleton.vue";
import TopGenres, {
  getTopGenres,
} from "@/components/dashboard/top-genres/TopGenres.vue";
import TopGenresSkeleton from "@/components/dashboard/top-genres/TopGenresSkeleton.vue";
import TopTracksSkeleton from "@/components/dashboard/top-tracks/TopTracks.Skeleton.vue";
import TopTracks from "@/components/dashboard/top-tracks/TopTracks.vue";
// import { delay } from "@/utilities/functions";
import SpotifyWebApi from "spotify-web-api-js";
import { defineAsyncComponent, h, type PropType } from "vue";

const token = window.$cookies.get("access_token");
const spotify = new SpotifyWebApi();
spotify.setAccessToken(token);

const props = defineProps({
  fetchedUser: { type: Object as PropType<Promise<any>>, required: true },
});

const AsyncGenresCard = defineAsyncComponent({
  loadingComponent: TopGenresSkeleton,
  loader: async () => {
    await props.fetchedUser;
    const genres = await getTopGenres(token);
    if (!genres) {
      throw Error("Couldn't get top genres");
    }
    return () => h(TopGenres, { genres });
  },
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

const AsyncTopTracksCard = defineAsyncComponent({
  loadingComponent: TopTracksSkeleton,
  loader: async () => {
    await props.fetchedUser;
    const tracks = await spotify.getMyTopTracks();
    return () => h(TopTracks, { tracks });
  },
});

const AsyncTopArtistsCard = defineAsyncComponent({
  loadingComponent: TopArtistsSkeleton,
  loader: async () => {
    await props.fetchedUser;
    const artists = await spotify.getMyTopArtists();
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
