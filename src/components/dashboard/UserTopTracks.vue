<script lang="ts">
import Spotify from "spotify-web-api-js";
import { defineComponent } from "vue";
import { IonIcon } from "@ionic/vue";
import { chevronForward, star } from "ionicons/icons";
import { UserTopItemsSort } from "@/types/types";
import DropdownMenu from "@/components/DropdownMenu.vue";
import NetworkImage from "../NetworkImage.vue";

export default defineComponent({
  components: {
    IonIcon,
    DropdownMenu,
    NetworkImage,
  },
  setup() {
    return { chevronForward, star, UserTopItemsSort };
  },
  data() {
    return {
      // eslint-disable-next-line no-undef
      topTracks: {} as SpotifyApi.UsersTopTracksResponse,
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
        this.topTracks = await this.spotify.getMyTopTracks({
          time_range: range,
        });
      } catch (error) {
        console.warn(error);
      }
    },
  },
  mounted() {
    this.spotify.setAccessToken(this.$cookies.get("access_token"));
    this.getUserTopItems(this.timeRange);
  },
});
</script>

<template>
  <div class="card">
    <div class="card-title-row">
      <h3 class="heading-tertiary">Your Top Tracks</h3>
      <DropdownMenu
        class="time-period-dropdown"
        name="select-track-period"
        v-on:value-change="getUserTopItems"
        :default-value="UserTopItemsSort.Medium"
        :options="[
          { label: 'All Time', value: UserTopItemsSort.Long },
          { label: '6 Months', value: UserTopItemsSort.Medium },
          { label: '4 Weeks', value: UserTopItemsSort.Short },
        ]"
      />
    </div>

    <div class="track-list">
      <div
        class="track-list-item"
        v-for="track in topTracks.items?.slice(0, 5)"
        :key="track.id"
      >
        <a :href="track.external_urls.spotify" target="_blank">
          <!-- <img
            class="track-image"
            alt="Track Image"
            :src="track.album.images[0].url"
          /> -->
          <NetworkImage
            class="track-image"
            alt="Track Image"
            :src="track.album.images[0].url"
          />
        </a>

        <div class="track-right">
          <div class="track-title-row">
            <a
              class="track-name link"
              :href="track.external_urls.spotify"
              target="_blank"
            >
              {{ track.name }}
            </a>
            <div class="track-popularity">
              <ion-icon :icon="star" />
              <span class=""> {{ track.popularity }} %</span>
            </div>
          </div>

          <div>
            <span
              class="track-genre"
              v-for="artist in track.artists.slice(0, 3)"
              :key="artist.id"
            >
              {{ artist.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <a class="action-button link" href="#" v-if="topTracks.items?.length > 5">
      <span>View More</span>
      <ion-icon :icon="chevronForward" />
    </a>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;

  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2.4rem;
}

.card * {
  transition: all 0.3s;
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.time-period-dropdown {
  float: right;
  font-size: 1.4rem;
}

.track-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.track-list-item {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.track-image {
  --size: 5rem;
  height: var(--size);
  width: var(--size);
  border-radius: var(--size);
  object-fit: cover;
}

.track-right {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
}

.track-title-row {
  display: flex;
  justify-content: space-between;
}

.track-name {
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

.track-popularity {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 1.5rem;
}

.track-popularity ion-icon {
  color: var(--primary-font-color);
  font-size: 2rem;
}

.track-genre {
  font-size: 1.2rem;
  color: #bbbbbb;
  text-transform: capitalize;
}

.track-genre:not(:last-child)::after {
  content: " | ";
}
</style>
