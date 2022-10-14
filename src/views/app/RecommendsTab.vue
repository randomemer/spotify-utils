<script lang="ts">
import { defineComponent } from "vue";
import Spotify from "spotify-web-api-js";
import type { SpotifySearchFilter } from "@/types/types";
import TrackItem from "@/components/TrackItem.vue";
import { IonIcon } from "@ionic/vue";
import { addCircle, close } from "ionicons/icons";

export default defineComponent({
  setup() {
    return { addCircle, close };
  },
  data() {
    return {
      spotify: new Spotify(),
      // eslint-disable-next-line no-undef
      searchResults: undefined as SpotifyApi.SearchResponse | undefined,
      results: [] as any[] | undefined,
      searchFilter: "track" as SpotifySearchFilter,
      seeds: {
        seed_tracks: new Map(),
        seed_artists: new Map(),
        seed_genres: new Map(),
      } as { [key: string]: Map<string, any> },
      // eslint-disable-next-line no-undef
      recommendedTracks: {} as SpotifyApi.RecommendationsFromSeedsResponse,
    };
  },
  computed: {
    seedsArr() {
      return Object.values(this.seeds).flatMap((set) => [...set.values()]);
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
            [this.searchFilter],
            { limit: 20 }
          );
          console.log(this.searchFilter, this.searchResults);
          this.results = this.searchResults[`${this.searchFilter}s`]?.items;
          console.log(this.results);
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
      const property = `seed_${this.searchFilter}s`;
      this.seeds[property].set(item.id, item);
      console.log(this.seeds);
    },
    removeSeed(event: Event, item: any) {
      const property = `seed_${this.searchFilter}s`;
      const target = event.target as HTMLElement;

      const chip = target.closest(".seed-chip");
      chip?.classList.add("delete");

      const listener = () => {
        this.seeds[property].delete(item.id);
      };

      chip?.ownerDocument.addEventListener("animationend", listener, false);
    },
  },
  components: { TrackItem, IonIcon },
});
</script>

<template>
  <main>
    <h3 class="heading-secondary">Generate Recommendations</h3>

    <!-- Input Area -->
    <input
      class="search-field"
      type="text"
      placeholder="Search"
      @keydown.enter="searchItems"
    />

    <!-- Chips -->
    <div class="chips-container">
      <div v-for="seed in seedsArr" :key="seed.id">
        <a class="seed-chip" :href="seed.external_urls.spotify" target="_blank">
          <span> {{ seed.name }}</span>
          <button class="remove-chip-button" @click="removeSeed($event, seed)">
            <IonIcon :icon="close" />
          </button>
        </a>
      </div>
      <button
        class="generate-button"
        type="button"
        @click="generate"
        v-if="seedsArr.length > 0"
      >
        Generate
      </button>
    </div>

    <!-- Search Results -->
    <ul class="search-results-container" v-if="searchResults">
      <li class="result-item" v-for="(item, i) in results" :key="i">
        <TrackItem :track="item" />
        <button type="button" class="add-button" @click="addSeed(item)">
          <ion-icon :icon="addCircle" />
        </button>
      </li>
    </ul>

    <div class="recommends-container" v-if="recommendedTracks">
      <TrackItem
        v-for="track in recommendedTracks.tracks"
        :key="track.id"
        :track="(track as any)"
      />
    </div>
  </main>
</template>

<style scoped>
.heading-secondary {
  margin-bottom: 4.8rem;
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
  width: 50%;
  margin-bottom: 3.6rem;
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

.chips-container {
  display: flex;
  flex-flow: row wrap;
  transition: width 0.3s;
  /* gap: 1.8rem; */
  margin-bottom: 3.6rem;
}

.seed-chip:visited,
.seed-chip:link {
  text-decoration: none;
  color: inherit;

  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  padding: 0.8rem 1.6rem;
  border-radius: 50rem;
  overflow: hidden;
  margin-right: 1.8rem;
}

.seed-chip.delete {
  animation: zoom forwards 0.7s ease-out 1;
}

.remove-chip-button {
  display: inline-block;
  font-size: 1.4rem;
  border-radius: 50rem;
  background: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
  display: flex;
  align-items: center;
}

.remove-chip-button:hover,
.remove-chip-button:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.add-button {
  background: none;
  color: #1db954;
  font-size: 2.4rem;
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
</style>
