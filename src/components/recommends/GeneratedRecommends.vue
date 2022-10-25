<script lang="ts">
import { db } from "@/main";
import {
  doc,
  DocumentSnapshot,
  getDoc,
  type DocumentData,
} from "firebase/firestore";
import { defineAsyncComponent, defineComponent, h } from "vue";
// import { IonIcon } from "@ionic/vue";
import { chevronBack, chevronForward } from "ionicons/icons";
import Spotify from "spotify-web-api-js";
import SeedsSource from "./seeds-source/SeedsSource.vue";
import SeedsSourceSkeleton from "./seeds-source/SeedsSourceSkeleton.vue";
import TracksTable from "./tracks-table/TracksTable.vue";
import TracksTableSkeleton from "./tracks-table/TracksTableSkeleton.vue";
import Cookies from "js-cookie";

const spotify = new Spotify();
const $cookies = window.$cookies;
if (!$cookies) throw Error("Couldn't fetch cookies");
spotify.setAccessToken($cookies.get("access_token"));

let recommendation: Promise<DocumentSnapshot<DocumentData>>;

export default defineComponent({
  components: {
    // IonIcon,
    AsyncTracksTable: defineAsyncComponent({
      loadingComponent: TracksTableSkeleton,
      loader: async () => {
        const rec = await recommendation;
        const tracks = rec.data()?.data.tracks;
        return () => h(TracksTable, { tracks });
      },
    }),
    AsyncSeedsSource: defineAsyncComponent({
      loadingComponent: SeedsSourceSkeleton,
      loader: async () => {
        const rec = await recommendation;

        const seeds: SpotifyApi.RecommendationsSeedObject[] | undefined =
          rec.data()?.data.seeds;
        console.log(seeds);
        if (!seeds) {
          throw new Error("Seeds Undefined");
        }

        for (const seed of seeds) {
          if (seed.type === "TRACK") {
            seed.item = await spotify.getTrack(seed.id);
          } else if (seed.type === "ARTIST") {
            seed.item = await spotify.getArtist(seed.id);
          } else {
            console.log("genre seed : ", seed.id);
            seed.item = seed.id;
          }
        }

        return () => h(SeedsSource, { seeds });
      },
    }),
  },
  beforeRouteEnter(to) {
    const docRef = doc(
      db,
      "generated-recommends",
      to.params.id.toString().trim()
    );
    recommendation = getDoc(docRef);
  },
  setup() {
    return { chevronBack, chevronForward };
  },
});
</script>

<template>
  <main>
    <h2 class="heading-secondary">Generated</h2>

    <AsyncTracksTable class="table" />

    <AsyncSeedsSource />
  </main>
</template>

<style scoped>
.heading-secondary {
  grid-column: span 2;
  margin-bottom: 6.4rem;
  display: none;
}

main {
  display: grid;
  column-gap: 4.8rem;
  align-items: flex-start;
  grid-template-columns: 70fr 30fr;
}
</style>
