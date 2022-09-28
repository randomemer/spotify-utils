<script lang="ts">
import { defineComponent } from "vue";
import MergePlaylistDialog from "@/components/MergePlaylistDialog.vue";

export default defineComponent({
  data() {
    return {
      user: {} as any,
      userImage: "",
      access_token: this.$cookies.get("access_token"),
    };
  },
  methods: {
    async fetchUserProfile() {
      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${this.$cookies.get("access_token")}`,
          },
        });
        const body = await response.json();
        // console.log(body);
        this.user = body;
        const [image] = body.images;
        this.userImage = image.url;
      } catch (error) {
        console.warn(error);
      }
    },
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
    (async () => {
      await this.getNewAccessToken();
      await this.fetchUserProfile();
    })();
  },
  components: { MergePlaylistDialog },
});
</script>

<template>
  <main class="container" :key="access_token">
    <div>
      <div class="hello-el">
        <img :src="userImage" class="pfp" />
        <h2 class="heading-secondary">Hello there, {{ user?.display_name }}</h2>
      </div>
    </div>

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
  display: flex;
  flex-direction: column;
  padding: 7.2rem 0;
  gap: 6.4rem;
}

.hello-el {
  display: flex;
  align-items: center;
  gap: 5rem;
}

.pfp {
  border-radius: 50rem;
  height: 15rem;
  width: 15rem;
}

.heading-secondary {
  margin-bottom: 3.2rem;
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
