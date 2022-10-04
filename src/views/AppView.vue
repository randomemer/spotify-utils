<script lang="ts">
import { defineComponent } from "vue";
import Spotify from "spotify-web-api-js";
import MergePlaylistDialog from "@/components/MergePlaylist/MergePlaylistDialog.vue";
import UserProfileCard from "@/components/UserProfileCard.vue";
import UserTopArtists from "../components/UserTopArtists.vue";
import UserTopTracks from "../components/UserTopTracks.vue";

export default defineComponent({
  data() {
    return {
      // eslint-disable-next-line no-undef
      user: {} as SpotifyApi.CurrentUsersProfileResponse,
      spotify: new Spotify(),
      access_token: this.$cookies.get("access_token") as string,
    };
  },
  methods: {
    async getNewAccessToken() {
      try {
        const client_id = import.meta.env.VITE_CLIENT_ID;
        const client_secret = import.meta.env.VITE_CLIENT_SECRET;

        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: this.$cookies.get("refresh_token"),
          }),
        });

        const body = await response.json();
        this.$cookies.set("access_token", body.access_token);
        this.spotify.setAccessToken(body.access_token);
      } catch (error) {
        console.warn(error);
      }
    },
    showMergeDialog() {
      (
        this.$refs.mergePlaylistDialog as typeof MergePlaylistDialog
      ).toggleModal();
    },
  },
  mounted() {
    this.getNewAccessToken();
  },
  components: {
    MergePlaylistDialog,
    UserProfileCard,
    UserTopArtists,
    UserTopTracks,
  },
});
</script>

<template>
  <main class="container" :key="access_token">
    <UserProfileCard class="profile-section" />

    <UserTopArtists />
    <UserTopTracks />

    <div class="actions-section">
      <button class="action-button" v-on:click="showMergeDialog">
        <span>Merge Playlists</span>
      </button>
    </div>
  </main>

  <MergePlaylistDialog ref="mergePlaylistDialog" :id="user?.id" />
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  flex-direction: column;
  row-gap: 6.4rem;
  column-gap: 5.6rem;

  padding: 7.2rem 0;
}

.profile-section {
  grid-column: span 2;
}

.actions-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.action-button {
  background-color: #1db954;
  border-radius: 2.5rem;
  padding: 1.2rem 0;
}

.playlists-section {
  padding: 4.2rem 0;
}

.playlists {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

.playlist {
  display: flex;
  align-items: center;
  gap: 2.4rem;
}

.playlist-info-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.playlist-image {
  height: 5rem;
  width: 5rem;
  border-radius: 5rem;
}

.playlist-name {
  font-size: 2rem;
}

.playlist-tracks {
  font-size: 1.6rem;
}
</style>
