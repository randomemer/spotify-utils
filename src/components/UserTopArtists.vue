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
      topArtists: {} as SpotifyApi.UsersTopArtistsResponse,
      spotify: new Spotify(),
    };
  },
  methods: {
    async getUserTopItems(): Promise<void> {
      try {
        this.topArtists = await this.spotify.getMyTopArtists({
          time_range: "medium_term",
        });
        console.log(this.topArtists.items?.slice(0, 5));
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
    <h3 class="heading-tertiary">Your Top Artists</h3>

    <div class="artist-list">
      <div
        class="artist-list-item"
        v-for="artist in topArtists.items?.slice(0, 5)"
        :key="artist.id"
      >
        <img
          class="artist-image"
          alt="Artist Image"
          :src="artist.images[0].url"
        />

        <div class="artist-right">
          <span class="artist-name">{{ artist.name }}</span>
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
  --size: 6.4rem;
  height: var(--size);
  width: var(--size);
  border-radius: var(--size);
}

.artist-right {
  display: flex;
  flex-direction: column;
}

.artist-name {
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
