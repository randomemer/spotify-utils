<script lang="ts">
import DropdownMenu from "@/components/DropdownMenu.vue";
import { UserTopItemsSort } from "@/types/enums";
import { IonIcon } from "@ionic/vue";
import { chevronForward, star } from "ionicons/icons";
import Spotify from "spotify-web-api-js";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  components: {
    IonIcon,
    DropdownMenu,
  },
  props: {
    artists: {
      type: Object as PropType<SpotifyApi.UsersTopArtistsResponse>,
      required: true,
    },
  },
  setup() {
    return { chevronForward, star, UserTopItemsSort };
  },
  data() {
    return {
      topArtists: this.artists,
      spotify: new Spotify(),
      timeRange: UserTopItemsSort.Medium,
      timeRanges: {
        "All Time": UserTopItemsSort.Long,
        "6 Months": UserTopItemsSort.Medium,
        "4 Weeks": UserTopItemsSort.Short,
      },
    };
  },
  methods: {
    async getUserTopItems(range: UserTopItemsSort): Promise<void> {
      try {
        this.topArtists = await this.spotify.getMyTopArtists({
          time_range: range,
        });
      } catch (error) {
        console.warn(error);
      }
    },
  },
  mounted() {
    this.spotify.setAccessToken(sessionStorage.getItem("access_token"));
  },
});
</script>

<template>
  <div class="card">
    <div class="card-title-row">
      <h3 class="heading-tertiary">Your Top Artists</h3>
      <DropdownMenu
        class="time-period-dropdown"
        name="select-artist-period"
        v-on:value-change="getUserTopItems"
        :default-value="UserTopItemsSort.Medium"
        :options="[
          { label: 'All Time', value: UserTopItemsSort.Long },
          { label: '6 Months', value: UserTopItemsSort.Medium },
          { label: '4 Weeks', value: UserTopItemsSort.Short },
        ]"
      />
    </div>

    <div class="artist-list">
      <div
        class="artist-list-item"
        v-for="artist in topArtists.items?.slice(0, 5)"
        :key="artist.id"
      >
        <a :href="artist.external_urls.spotify" target="_blank">
          <img
            class="artist-image"
            alt="Artist Image"
            :src="artist.images[0].url"
          />
        </a>

        <div class="artist-right">
          <div class="artist-title-row">
            <a
              class="artist-name link"
              target="_blank"
              :href="artist.external_urls.spotify"
            >
              {{ artist.name }}
            </a>
            <div class="artist-popularity">
              <ion-icon :icon="star" />
              <span class=""> {{ artist.popularity }} %</span>
            </div>
          </div>

          <div>
            <span
              class="artist-genre"
              v-for="genre in artist.genres.slice(0, 3)"
              :key="genre"
            >
              {{ genre }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <a class="action-button link" href="#" v-if="topArtists.items?.length > 5">
      <span>View More</span>
      <ion-icon :icon="chevronForward" />
    </a>
  </div>
</template>

<style scoped>
@import "./top-artists.css";

.card * {
  transition: all 0.3s;
}

.time-period-dropdown {
  float: right;
  font-size: 1.4rem;
}

.artist-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.artist-list-item {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.artist-image {
  --size: 5rem;
  height: var(--size);
  width: var(--size);
  border-radius: var(--size);
  object-fit: cover;
}

.artist-right {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
}

.artist-title-row {
  display: flex;
  justify-content: space-between;
}

.artist-name {
  font-size: 1.8rem;
}

.action-button:link,
.action-button:visited {
  align-self: flex-end;
  border-radius: 5px;
  color: var(--primary-font-color);
  font-size: 1.2rem;
  padding: 1.4rem;

  display: flex;
  align-items: center;
  text-transform: uppercase;
  gap: 0.5rem;
}

.action-button:active,
.action-button:hover {
  background-color: var(--splash-color);
}

.artist-popularity {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 1.5rem;
}

.artist-popularity ion-icon {
  color: var(--primary-font-color);
  font-size: 2rem;
}

.artist-genre {
  font-size: 1.2rem;
  color: #bbbbbb;
  text-transform: capitalize;
}

.artist-genre:not(:last-child)::after {
  content: " | ";
}
</style>
