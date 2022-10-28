<script lang="ts">
import { db } from "@/main";
import {
  doc,
  DocumentSnapshot,
  getDoc,
  type DocumentData,
} from "firebase/firestore";
import { defineAsyncComponent, defineComponent, h } from "vue";
import { chevronBack, chevronForward } from "ionicons/icons";
import Spotify from "spotify-web-api-js";
import SeedsSource from "./seeds-source/SeedsSource.vue";
import SeedsSourceSkeleton from "./seeds-source/SeedsSourceSkeleton.vue";
import TracksTable from "./tracks-table/TracksTable.vue";
import TracksTableSkeleton from "./tracks-table/TracksTableSkeleton.vue";
import ModalDialog from "@/components/ModalDialog.vue";

const spotify = new Spotify();
const $cookies = window.$cookies;
if (!$cookies) throw Error("Couldn't fetch cookies");
spotify.setAccessToken($cookies.get("access_token"));

let recommendation: Promise<DocumentSnapshot<DocumentData>>;

export default defineComponent({
  components: {
    // IonIcon,
    ModalDialog,
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
          if (seed.type.toLowerCase() === "track") {
            seed.item = await spotify.getTrack(seed.id);
          } else if (seed.type.toLowerCase() === "artist") {
            seed.item = await spotify.getArtist(seed.id);
          } else {
            seed.item = seed.id;
          }
        }

        return () => h(SeedsSource, { seeds });
      },
    }),
  },
  setup() {
    return { chevronBack, chevronForward };
  },
  beforeRouteEnter(to) {
    const docRef = doc(
      db,
      "generated-recommends",
      to.params.id.toString().trim()
    );
    recommendation = getDoc(docRef);
  },
  data() {
    return {
      isModalOpen: false,
      playlistName: "",
      playlistDescription: "",
    };
  },
  computed: {
    playlistModal() {
      return this.$refs.playlistModal as InstanceType<typeof ModalDialog>;
    },
  },
  methods: {
    async savePlaylist() {
      const rec = await recommendation;
      const tracks = rec.data()?.data.tracks as SpotifyApi.TrackObjectFull[];
      const account: AccountCookie = window.$cookies.get("current_user");
      const id = account.user.id;

      // create a playlist
      const playlist = await spotify.createPlaylist(id, {
        name: this.playlistName,
        public: false,
        description: this.playlistDescription,
      });

      // add tracks to playlist
      const trackIDs = tracks.map((track) => track.uri);
      while (trackIDs.length > 0) {
        const batch = trackIDs.splice(0, 50);
        spotify.addTracksToPlaylist(playlist.id, batch);
        console.log(batch);
      }

      console.log(playlist.external_urls.spotify);
    },
  },
});
</script>

<template>
  <main>
    <h2 class="heading-secondary">Generated</h2>

    <AsyncTracksTable class="table" />

    <div class="right-pane">
      <AsyncSeedsSource />
      <button class="button" @click="playlistModal.isModalOpen = true">
        Save As Playlist
      </button>
    </div>

    <ModalDialog ref="playlistModal">
      <form class="save-tracks-form" @submit.prevent="savePlaylist">
        <h3 class="heading-tertiary">Save your recommendation</h3>
        <input
          type="text"
          class="playlist-name-input"
          placeholder="Playlist Name"
          v-model="playlistName"
        />
        <textarea
          rows="5"
          class="playlist-desc input"
          placeholder="Playlist Description"
        ></textarea>
        <button class="button">Save</button>
      </form>
    </ModalDialog>
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

.button {
  font-size: 1.8rem;
  width: 100%;
}

.playlist-name-input {
  border-radius: 5px;
  font-size: 1.8rem;
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.8rem 1.6rem;
}

.playlist-desc {
  resize: none;
  border-radius: 5px;
}

.save-tracks-form {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

.save-tracks-form h3 {
  margin-right: 6.4rem;
}

.save-tracks-form button {
  width: auto;
  align-self: flex-end;
}

.right-pane {
  position: sticky;
  top: 6.4rem;
}
</style>
