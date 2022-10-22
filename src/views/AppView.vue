<script lang="ts">
import app from "@/main";
import { defineComponent } from "vue";
import NavBar from "@/components/NavBar.vue";
import type { AccountCookie } from "@/types/types";

const client_id = import.meta.env.VITE_CLIENT_ID;
const client_secret = import.meta.env.VITE_CLIENT_SECRET;

export default defineComponent({
  methods: {
    async getNewAccessToken() {
      try {
        const account: AccountCookie = this.$cookies.get("current_user");
        console.log(account);
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: account.refresh_token,
          }),
        });

        const body = await response.json();
        this.$cookies.set("access_token", body.access_token);
        app.config.globalProperties.access_token = body.access_token;
      } catch (error) {
        console.warn(error);
      }
    },
  },
  created() {
    this.getNewAccessToken();
  },
  components: {
    NavBar,
  },
});
</script>

<template>
  <div class="app-container">
    <NavBar />
    <RouterView class="app-main" />
  </div>
</template>

<style scoped>
.app-container {
  position: fixed;
  height: 100%;
  width: 100%;

  display: grid;
  grid-template-columns: 15fr 85fr;
  align-items: stretch;
}

.app-main {
  padding: 6.4rem;
  overflow-y: scroll;
  flex: 1;
  scrollbar-color: red yellow;
}

.action-button {
  background-color: #1db954;
  border-radius: 2.5rem;
  padding: 1.2rem 0;
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
