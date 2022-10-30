<script lang="ts">
import { defineComponent } from "vue";
import { stringifyQuery } from "vue-router";
import SpotifyWebApi from "spotify-web-api-js";
import { getUserProfileImage } from "@/utilities/functions";

const scopes = [
  // user
  "user-read-email",
  "user-read-private",
  // playlist
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
  // player
  "app-remote-control",
  "streaming",
  // connect
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  // listening history
  "user-read-playback-position",
  "user-top-read",
  "user-read-recently-played",
];

const client_id = import.meta.env.VITE_CLIENT_ID;
const client_secret = import.meta.env.VITE_CLIENT_SECRET;

export default defineComponent({
  setup() {
    async function retrieveSpotifyTokens(code: string) {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: code.toString(),
          redirect_uri: `${location.origin}/auth`,
          grant_type: "authorization_code",
        }),
      });
      return await response.json();
    }

    return { getUserProfileImage, retrieveSpotifyTokens };
  },
  methods: {
    loginUser(account: Account) {
      this.$cookies.set("current_user", JSON.stringify(account));
      this.$router.replace("/app");
    },
  },
  beforeCreate() {
    const code = this.$route.query.code;

    if (code) {
      (async () => {
        // Get refresh tokens from spotify
        const tokens = await this.retrieveSpotifyTokens(code.toString());

        // get user data and set local storage data
        const spotify = new SpotifyWebApi();
        spotify.setAccessToken(tokens.access_token);
        const account: Account = {
          user: await spotify.getMe(),
          refresh_token: tokens.refresh_token,
        };
        localStorage.setItem("current_user", JSON.stringify(account));
        sessionStorage.setItem("access_token", tokens.access_token);

        // Redirect to app
        this.$router.push("/app");
      })();

      return;
    }

    // If user has previously logged in
    const currentUser = localStorage.getItem("current_user");
    if (currentUser) {
      console.log("Current User : ", JSON.parse(currentUser));
      this.$router.push("/app");
      return;
    }

    // Prompt the user to connect to spotify
    location.href = `https://accounts.spotify.com/authorize?${stringifyQuery({
      response_type: "code",
      client_id: client_id,
      scope: scopes.join(" "),
      // state: this.$cookies.get("state"),
      redirect_uri: `${location.origin}/auth`,
    })}`;
  },
});
</script>

<template>
  <main></main>
</template>
