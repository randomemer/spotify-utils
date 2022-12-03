<script lang="ts">
import { spotify } from "@/utilities/spotify-api";
import { defineComponent } from "vue";
import { stringifyQuery } from "vue-router";

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

    return { retrieveSpotifyTokens };
  },
  beforeCreate() {
    const code = this.$route.query.code;
    if (code) {
      (async () => {
        // Get refresh tokens from spotify
        const tokens = await this.retrieveSpotifyTokens(code.toString());
        // get user data and set local storage data
        spotify.setAccessToken(tokens.access_token);
        const account: Account = {
          user: await this.$spotify.getMe(),
          refresh_token: tokens.refresh_token,
        };
        localStorage.setItem("current_user", JSON.stringify(account));
        sessionStorage.setItem("access_token", tokens.access_token);
        // Redirect to app
        this.$router.replace("/app");
      })();
      return;
    }
    // If user has previously logged in
    const currentUser = localStorage.getItem("current_user");
    if (currentUser) {
      console.log("Current User : ", JSON.parse(currentUser));
      this.$router.replace("/app");
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
  <div class="center-box">
    <h3 class="heading-tertiary">Hang On</h3>
    <div class="loading-svg">
      <div class="bar" v-for="(_, i) in Array(4)" :key="i">
        <div class="moving-bar"></div>
      </div>
    </div>
    <span class="redirecting">Redirecting</span>
  </div>
</template>

<style scoped lang="scss">
@use "sass:list";
@use "sass:map";

.center-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 4.8rem;

  width: 25vw;
  /* height: 40vh; */

  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  align-items: center;
  justify-content: space-between;
}

.redirecting {
  font-size: 1.8rem;

  &::after {
    content: " ...";
    letter-spacing: 5px;
    text-transform: uppercase;
  }
}

.loading-svg {
  background-color: black;
  border-radius: 5px;
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  padding: 1rem;
  height: 7.5rem;
  // width: 70px;

  .bar {
    width: 8px;
    height: 100%;
    vertical-align: bottom;
    display: flex;
    align-items: flex-end;
    .moving-bar {
      background-color: general.$primary-color;
      border-radius: 2px;
      width: 100%;
      height: 50%;
    }
  }
}

@mixin bar-keyframes($values) {
  $frames: (0, 25, 50, 75, 100);

  @for $i from 1 through length($values) {
    #{nth($frames, $i)}% {
      height: nth($values, $i);
    }
  }
}

@mixin bar-animation($name, $values) {
  @keyframes #{$name} {
    @include bar-keyframes($values);
  }
}

.bar {
  $frames: (
    // prettier-ignore
    (40%, 70%, 100%, 70%, 40%),
    (70%, 100%, 70%, 40%, 70%),
    (0%, 30%, 60%, 30%, 0%),
    (100%, 70%, 40%, 70%, 100%)
  );

  @for $i from 1 through 4 {
    &:nth-child(#{$i}) .moving-bar {
      @include bar-animation("bar-animation-#{$i}", nth($frames, $i));
      animation-name: bar-animation-#{$i};
      animation-duration: 1.5s;
      animation-iteration-count: infinite;
    }
  }
}
</style>
