<script lang="ts">
import { defineComponent } from "vue";
import Spotify from "spotify-web-api-js";
import type { SpotifySearchFilter } from "@/types/types";
import TrackItem from "@/components/TrackItem.vue";
import { IonIcon } from "@ionic/vue";
import { addCircle, close, musicalNote } from "ionicons/icons";
import TabBar from "@/components/TabBar.vue";
import ArtistItem from "@/components/ArtistItem.vue";
import _ from "lodash";

export default defineComponent({
  setup() {
    return { addCircle, close, musicalNote };
  },
  data() {
    return {
      spotify: new Spotify(),
      // eslint-disable-next-line no-undef
      searchResults: undefined as SpotifyApi.SearchResponse | undefined,
      results: [] as any[] | undefined,
      searchFilter: "track" as SpotifySearchFilter,
      seeds: {
        track: new Map(),
        artist: new Map(),
        genre: new Map(),
      } as { [key: string]: Map<string, any> },
      // eslint-disable-next-line no-undef
      recommendedTracks: {} as SpotifyApi.RecommendationsFromSeedsResponse,
    };
  },
  computed: {
    seedsArr() {
      return Object.entries(this.seeds).flatMap(([seedType, seeds]) => {
        const arr = [];
        for (const seed of seeds.values()) {
          arr.push({ seed, type: seedType });
        }
        return arr;
      });
    },
  },
  mounted() {
    const token = this.$cookies.get("access_token");
    this.spotify.setAccessToken(token);
  },
  methods: {
    async searchItems(event: KeyboardEvent) {
      try {
        const searchInput = event.target as HTMLInputElement;
        if (this.searchFilter !== "genre") {
          // Search for tracks or genres
          this.searchResults = await this.spotify.search(
            searchInput.value,
            ["track", "artist"],
            { limit: 20 }
          );
          console.log(this.searchResults);
          this.results = this.searchResults[`${this.searchFilter}s`]?.items;
        } else {
          // Search for genres
        }
      } catch (error) {
        console.error(error);
      }
    },
    async generate() {
      this.searchResults = undefined;

      try {
        this.recommendedTracks = await this.spotify.getRecommendations({
          seed_artists: [...this.seeds.seed_artists.keys()],
          seed_tracks: [...this.seeds.seed_tracks.keys()],
        });
        console.log(this.recommendedTracks);
      } catch (error) {
        console.error(error);
      }
    },
    addSeed(item: any) {
      const property = this.searchFilter;
      this.seeds[property].set(item.id, item);
    },
    removeSeed(event: Event, item: any) {
      const property = this.searchFilter;

      for (const [k, v] of this.seeds[property].entries()) {
        if (v === item) {
          this.seeds[property].delete(k);
          break;
        }
      }

      // const target = event.target as HTMLElement;
      // const chip = target.closest(".seed-chip");
      // chip?.classList.add("delete");

      // const listener = () => {
      //   this.seeds[property].delete(item.id);
      // };

      // chip?.ownerDocument.addEventListener("animationend", listener, false);
    },
    onTabChange(event: SpotifySearchFilter) {
      this.searchFilter = event;
      this.results = this.searchResults[`${event}s`]?.items;
    },
  },
  components: { TrackItem, IonIcon, TabBar, ArtistItem },
});
</script>

<template>
  <main>
    <h3 class="heading-secondary">Generate Recommendations</h3>

    <div class="grid">
      <div class="search-pane">
        <!-- Input Area -->
        <input
          class="search-field"
          type="search"
          placeholder="Search"
          @keydown.enter="searchItems"
        />

        <!-- Tabs -->
        <TabBar
          class="tabbar"
          :tabs="[
            { value: 'track', label: 'Tracks' },
            { value: 'artist', label: 'Artists' },
            { value: 'genre', label: 'Genres' },
          ]"
          v-on:tab-change="onTabChange"
        />

        <!-- Search Results -->
        <ul class="search-results-container" v-if="searchResults">
          <li class="result-item" v-for="(item, i) in results" :key="i">
            <TrackItem :track="item" v-if="searchFilter === 'track'" />
            <ArtistItem :artist="item" v-else-if="searchFilter === 'artist'" />

            <button type="button" class="add-button" @click="addSeed(item)">
              <ion-icon :icon="addCircle" />
            </button>
          </li>
        </ul>
      </div>

      <div class="seeds-cart">
        <h3>Selected Seeds</h3>

        <ul v-if="seedsArr.length">
          <li v-for="seed in seedsArr" :key="seed.seed">
            <TrackItem :track="seed.seed" v-if="seed.type === 'track'" />
            <button
              class="remove-seed-button"
              @click="removeSeed($event, seed.seed)"
            >
              <ion-icon :icon="close" />
            </button>
          </li>
        </ul>
        <div class="empty-seeds" v-else>
          <ion-icon :icon="musicalNote" />
          <span>Select upto 5 tracks, artists or genres</span>
        </div>

        <button
          class="generate-button"
          type="button"
          @click="generate"
          v-if="seedsArr.length"
        >
          Generate
        </button>
      </div>
    </div>

    <!-- <div class="recommends-container" v-if="recommendedTracks">
      <TrackItem
        v-for="track in recommendedTracks.tracks"
        :key="track.id"
        :track="(track as any)"
      />
    </div> -->
  </main>
</template>

<style scoped>
.heading-secondary {
  margin-bottom: 4.8rem;
}

.grid {
  display: grid;
  gap: 4.8rem;
  grid-template-columns: 60fr 40fr;
  align-items: flex-start;
}

.search-pane {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.search-results-container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  list-style: none;
}

.search-field {
  border-radius: 5px;
  font-size: 1.8rem;
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.8rem 1.6rem;
  margin-bottom: 3.6rem;
}

.tabbar {
  margin-bottom: 4.8rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
}

.generate-button {
  background-color: #1db954;
  padding: 0.8rem 1.6rem;
  border-radius: 50rem;
}

.seed-chip.delete {
  animation: zoom forwards 0.7s ease-out 1;
}

.remove-seed-button {
  align-self: center;
  font-size: 3rem;
  border-radius: 50rem;
  background: none;
  cursor: pointer;
  color: red;
  display: flex;
  align-items: center;
}

.remove-seed-button:hover,
.remove-seed-button:active {
  /* background-color: rgba(255, 255, 255, 0.2); */
  color: rgba(255, 0, 0, 0.6);
}

.add-button {
  background: none;
  color: #1db954;
  font-size: 3.6rem;
}

@keyframes zoom {
  0% {
    transform: scale(1);
    /* flex: 0 1 auto; */
    opacity: 1;
    transform-origin: 50% 50%;
  }
  50% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    /* flex: 0 1 0; */
    width: 0;
    transform: scale(0);
    opacity: 0;
    padding: 0;
    margin: 0;
  }
}

.recommends-container {
  display: flex;
  flex-direction: column;
}

.seeds-cart {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;

  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2.4rem;
}

.seeds-cart h3 {
  font-size: 2.4rem;
  font-weight: 600;
}

.seeds-cart ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.seeds-cart ul li {
  display: flex;
  justify-content: space-between;
}

.empty-seeds {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  align-items: center;
  gap: 3rem;
  margin: 3rem 0;
}

.empty-seeds ion-icon {
  font-size: 7.2rem;
  color: rgba(255, 255, 255, 0.3);
}

.empty-seeds span {
  font-size: 1.6rem;
}
</style>
