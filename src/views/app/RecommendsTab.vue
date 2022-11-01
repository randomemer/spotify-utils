<script lang="ts">
import ArtistItem from "@/components/ArtistItem.vue";
import TabBar from "@/components/TabBar.vue";
import TrackItem from "@/components/track/TrackItem.vue";
import GenreItem from "@/components/GenreItem.vue";
import { db } from "@/main";
import { IonIcon, IonSpinner } from "@ionic/vue";
import { addDoc, collection } from "firebase/firestore";
import { add, close, musicalNote, musicalNotes } from "ionicons/icons";
import MiniSearch from "minisearch";
import { defineComponent } from "vue";
import { spotify } from "@/utilities/spotify-api";

export default defineComponent({
  components: { TrackItem, IonIcon, IonSpinner, TabBar, ArtistItem, GenreItem },
  setup() {
    return { add, close, musicalNote, musicalNotes };
  },
  mounted() {
    this.getAvailableGenres();
  },
  data() {
    return {
      miniSearch: new MiniSearch({
        fields: ["genre"],
        storeFields: ["genre"],
        searchOptions: { fuzzy: 0.5, boost: { genre: 2 } },
      }),
      availableGenres: [] as string[],
      searchResults: {
        genres: undefined,
        tracks: undefined,
        artists: undefined,
      } as SpotifyApi.SearchResponse & { genres?: string[] },
      results: [] as any[] | undefined,
      searchFilter: "track" as SpotifySearchFilter,
      seeds: [] as Seed[],
      recommendedTracks: {} as SpotifyApi.RecommendationsFromSeedsResponse,
      isGenerating: false,
    };
  },
  methods: {
    async getAvailableGenres() {
      const { genres } = await spotify.getAvailableGenreSeeds();
      this.availableGenres = genres;
      this.miniSearch.addAll(
        genres.map((genre, i) => ({ id: i, genre: genre }))
      );
    },
    async searchItems(event: KeyboardEvent) {
      try {
        const searchInput = event.target as HTMLInputElement;

        // Search for tracks or genres
        this.searchResults = await spotify.search(
          searchInput.value,
          ["track", "artist"],
          { limit: 20 }
        );
        // Search for genres
        const genreResults = this.miniSearch.search(searchInput.value);
        this.searchResults.genres = genreResults.map((match) => match.genre);

        if (this.searchFilter !== "genre") {
          this.results = this.searchResults[`${this.searchFilter}s`]?.items;
        } else {
          this.results = this.searchResults["genres"];
        }
      } catch (error) {
        console.error(error);
      }
    },
    async generate() {
      if (this.isGenerating === true) return;
      this.isGenerating = true;
      try {
        // await delay(5000000000);
        // Get Reccomendations
        const getSeedsOfType = (type: SpotifySearchFilter) =>
          this.seeds
            .filter((seed) => seed.type === type)
            .map((seed) => seed.id);

        const recommendations = await spotify.getRecommendations({
          seed_artists: getSeedsOfType("artist"),
          seed_tracks: getSeedsOfType("track"),
          seed_genres: getSeedsOfType("genre"),
          limit: 100,
        });
        console.log(recommendations);

        // Save to firestore
        const dbCollection = collection(db, "generated-recommends");
        const account: Account = this.$cookies.get("current_user");
        const saved = await addDoc(dbCollection, {
          spotify_user: account.user,
          data: recommendations,
        });
        console.log(saved.id);

        // Redirect to generated playlist page
        this.$router.push(`/app/recommends/${saved.id}`);
      } catch (error) {
        console.error(error);
      }
      this.isGenerating = false;
    },
    addSeed(item: SeedItem) {
      if (typeof item === "object") {
        console.log("Type matches");
        item.id;
      }

      const newSeed: Seed = {
        id: typeof item === "object" ? item.id : item,
        type: this.searchFilter,
        seed: item,
      } as Seed;

      newSeed.seed.valueOf() === Object;
      if (!this.seeds.find((seed) => seed.id === newSeed.id)) {
        this.seeds.push(newSeed);
      }
    },
    removeSeed(event: Event, item: Seed) {
      const index = this.seeds.findIndex((seed) => seed.id == item.id);
      this.seeds.splice(index, 1);

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
      if (this.searchResults) {
        const results = this.searchResults[`${event}s`];
        if (this.searchFilter === "genre") {
          this.results = results ? this.availableGenres : results;
        } else {
          this.results = (
            results as Partial<
              SpotifyApi.PagingObject<
                SpotifyApi.ArtistObjectFull | SpotifyApi.TrackObjectFull
              >
            >
          )?.items;
        }
      }
    },
    onSearchTextChange(event: Event) {
      const searchInput = event.target as HTMLInputElement;
      if (searchInput.value === "") {
        this.searchResults = {
          tracks: undefined,
          artists: undefined,
          genres: this.availableGenres,
        };
        this.results = this.searchResults[`${this.searchFilter}s`] as
          | string[]
          | undefined;
      }
    },
  },
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
          @input="onSearchTextChange"
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
            <GenreItem :genre="item" v-else />

            <button type="button" class="add-button" @click="addSeed(item)">
              <ion-icon :icon="add" />
            </button>
          </li>
        </ul>
      </div>

      <div class="seeds-cart">
        <h3>Selected Seeds</h3>

        <ul v-if="seeds.length">
          <li v-for="seed in seeds" :key="seed.id">
            <TrackItem :track="seed.seed" v-if="seed.type === 'track'" />
            <ArtistItem
              :artist="seed.seed"
              v-else-if="seed.type === 'artist'"
            />
            <GenreItem :genre="seed.seed" v-else />

            <button
              class="remove-seed-button"
              @click="removeSeed($event, seed)"
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
          :class="{ loading: isGenerating }"
          v-if="seeds.length"
        >
          <ion-spinner v-if="isGenerating"></ion-spinner>
          <span>{{ isGenerating ? "Generating" : "Generate" }}</span>
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
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
  background-color: $card-color;
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
  background-color: $primary-color;
  color: $font-color;
  padding: 0.8rem 1.6rem;
  border-radius: 50rem;
  font-size: 1.6rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

@keyframes loading-bg {
  0% {
    background-color: $primary-color;
  }

  50% {
    background-color: rgba(115, 0, 153, 0.5);
  }

  100% {
    background-color: $primary-color;
  }
}

.generate-button.loading {
  animation: loading-bg 1.5s infinite;
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
  color: $danger-color;
  display: flex;
  align-items: center;
}

.remove-seed-button:hover,
.remove-seed-button:active {
  color: rgba(254, 78, 69, 0.6);
}

.add-button {
  background: $primary-color;
  color: $font-color;
  $size: 3.6rem;
  align-self: center;
  font-size: 2.4rem;
  height: $size;
  width: $size;
  border-radius: $size;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
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
  position: sticky;
  top: 6.4rem;
  flex-direction: column;
  gap: 2.4rem;

  background-color: $card-color;
  border-radius: 1rem;
  padding: 2.4rem;
  transition: all 0.3s;

  h3 {
    font-size: 2.4rem;
    font-weight: 600;
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1.8rem;

    li {
      display: flex;
      justify-content: space-between;
    }
  }
}

.empty-seeds {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  align-items: center;
  gap: 3rem;
  margin: 3rem 0;

  ion-icon {
    font-size: 7.2rem;
    color: rgba(255, 255, 255, 0.3);
  }

  span {
    font-size: 1.6rem;
  }
}
</style>
