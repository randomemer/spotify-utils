<script lang="ts">
import Spotify from "spotify-web-api-js";
import { defineComponent } from "vue";
import { IonIcon } from "@ionic/vue";
import { chevronForward } from "ionicons/icons";

export default defineComponent({
  components: {
    IonIcon,
  },
  setup() {
    return { chevronForward };
  },
  data() {
    return {
      // eslint-disable-next-line no-undef
      topTracks: {} as SpotifyApi.UsersTopTracksResponse,
      spotify: new Spotify(),
    };
  },
  methods: {
    async getUserTopItems(): Promise<void> {
      try {
        this.topTracks = await this.spotify.getMyTopTracks({
          time_range: "medium_term",
        });
        console.log(this.topTracks.items?.slice(0, 5));
      } catch (error) {
        console.warn(error);
      }
    },
  },
  mounted() {
    this.getUserTopItems();
  },
});
</script>

<template>
  <div class="card">
    <h3 class="heading-tertiary">Your Top Tracks</h3>

    <div class="track-list">
      <div
        class="track-list-item"
        v-for="track in topTracks.items?.slice(0, 5)"
        :key="track.id"
      >
        <img
          class="track-image"
          alt="Track Image"
          :src="track.album.images[0].url"
        />

        <div class="track-right">
          <span class="track-name">{{ track.name }}</span>
        </div>
      </div>
    </div>

    <a class="action-button link" href="#"
      ><span>View More</span><ion-icon :icon="chevronForward"></ion-icon
    ></a>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;

  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.8rem;
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
  --size: 6.4rem;
  height: var(--size);
  width: var(--size);
  border-radius: var(--size);
}

.track-right {
  display: flex;
  flex-direction: column;
}

.track-name {
  font-size: 1.8rem;
}

.action-button:link,
.action-button:visited {
  align-self: flex-end;
  color: #1db954;
  font-size: 1.4rem;
  padding: 1.4rem;

  display: flex;
  align-items: center;
  text-transform: uppercase;
  gap: 0.5rem;
}

.action-button:active,
.action-button:hover {
  background-color: rgba(29, 185, 84, 0.2);
  border-radius: 5px;
}
</style>
