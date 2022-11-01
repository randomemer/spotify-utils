<script lang="ts">
import { defineComponent } from "vue";
import { IonIcon } from "@ionic/vue";
import { trashOutline } from "ionicons/icons";

export default defineComponent({
  components: { IonIcon },
  props: {
    playlistUrl: { type: String, required: true },
    deleteCallback: { type: Function, required: true },
  },
  setup() {
    return { trashOutline };
  },
  data() {
    return {
      playlist: {} as any,
    };
  },
  computed: {
    id() {
      const url = new URL(this.playlistUrl);
      const paths = url.pathname.split("/");
      return paths[paths.length - 1];
    },
    imageUrl() {
      const [image] = this.playlist?.images || [{}];
      return image.url || "";
    },
  },
  methods: {
    async getPlaylist() {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${this.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.$cookies.get("access_token")}`,
            },
          }
        );

        const body = await response.json();
        console.log(body.tracks.items);
        this.playlist = body;
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    this.getPlaylist();
  },
});
</script>

<template>
  <div class="playlist-item">
    <img :src="imageUrl" class="playlist-cover" />

    <div class="playlist-info">
      <span class="playlist-title">{{ playlist.name }}</span>
      <span class="playlist-tracks">{{ playlist.tracks?.total }} Tracks</span>
    </div>

    <button
      type="button"
      class="delete-item-button"
      v-on:click="deleteCallback()"
    >
      <ion-icon :icon="trashOutline"></ion-icon>
    </button>
  </div>
</template>

<style scoped lang="scss">
.playlist-item {
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 3rem;
}

.playlist-cover {
  height: 5rem;
  width: 5rem;
}

.playlist-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 1.2rem;
}

.playlist-title {
  font-size: 1.8rem;
}

.playlist-tracks {
  font-size: 1.2rem;
}

.delete-item-button {
  font-size: 2.4rem;
  padding: 0.5rem;
  border-radius: 3rem;
  display: flex;
  align-items: center;
  background-color: red;
}
</style>
