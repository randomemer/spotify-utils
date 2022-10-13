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
      searchResults: {} as SpotifyApi.SearchResponse,
      results: [] as any[] | undefined,
      searchFilter: "track" as SpotifySearchFilter,
      seeds: {
        seed_tracks: new Map(),
        seed_artists: new Map(),
        seed_genres: new Map(),
      } as { [key: string]: Map<string, object> },
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
      console.log(this.seedsArr);
    },
    removeSeed(item: any) {
      const property = `seed_${this.searchFilter}s`;
      this.seeds[property].delete(item.id);
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
      <div class="seed-chip" v-for="(seed, i) in seedsArr" :key="i">
        <span> {{ seed.name }}</span>
        <button class="remove-chip-button" @click="removeSeed(seed)">
          <IonIcon :icon="close" />
        </button>
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
    <ul class="search-results-container">
      <li class="result-item" v-for="(item, i) in results" :key="i">
        <TrackItem :track="item" />
        <button type="button" class="add-button" @click="addSeed(item)">
          <ion-icon :icon="addCircle" />
        </button>
      </li>
    </ul>
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
  gap: 1.8rem;
  margin-bottom: 3.6rem;
}

.seed-chip {
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  padding: 0.8rem 1.6rem;
  border-radius: 50rem;
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
  /* text-align: center;
  vertical-align: middle; */
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
</style>
