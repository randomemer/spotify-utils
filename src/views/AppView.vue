<script lang="ts">
import { defineComponent } from "vue";

// async function getPlaylists(): any {

// }

export default defineComponent({
  data(): { [key: string]: any } {
    return {
      user: null,
      playlists: [],
    };
  },
  created() {
    // Get a new access token
    console.log(this.$cookies.get("refresh_token"));

    // Fetch User deatils
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${this.$cookies.get("access_token")}` },
    }).then(async (response) => {
      const body = await response.json();
      console.log(body);
      this.$data.user = body;
    });

    // Fetch user playlists
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.$cookies.get("access_token")}`,
      },
    }).then(async (response) => {
      const body = await response.json();
      console.log(body.items);
      this.$data.playlists = body.items;
    });
  },
});
</script>

<template>
  <div class="container">
    <div>
      <div class="hello-el">
        <img :src="user?.images[0].url" class="pfp" />
        <h2 class="heading-secondary">Hello there, {{ user?.display_name }}</h2>
      </div>
    </div>

    <div class="playlists-section">
      <h2 class="heading-secondary">Your Playlists</h2>
      <ul class="playlists">
        <li v-for="playlist in playlists" :key="playlist.id" class="playlist">
          <a :href="playlist.external_urls.spotify" target="_blank">
            <img :src="playlist?.images[0].url" class="playlist-image" />
          </a>

          <div class="playlist-info-col">
            <h3 class="playlist-name">{{ playlist?.name ?? "null" }}</h3>
            <span class="playlist-tracks"
              >{{ playlist?.tracks.total }} Tracks</span
            >
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
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
