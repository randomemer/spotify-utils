<script lang="ts">
import { defineComponent } from "vue";
import { stringifyQuery } from "vue-router";
import Spotify from "spotify-web-api-js";
import type { AccountsCookie } from "@/types/types";
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
  data() {
    return {
      accounts: [] as AccountsCookie,
    };
  },
  setup() {
    return { getUserProfileImage };
  },
  methods: {
    async retrieveSpotifyTokens(code: string) {
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
    },
    // eslint-disable-next-line no-undef
    loginUser(account: SpotifyApi.UserProfileResponse) {
      this.$cookies.set("current_user", account);
      this.$router.replace("/app");
    },
  },
  beforeCreate() {
    const code = this.$route.query.code;
    const accountsJSON = this.$cookies.get("accounts");
    const accounts: AccountsCookie =
      (accountsJSON && JSON.parse(accountsJSON)) || [];

    if (code) {
      (async () => {
        // Get refresh tokens from spotify
        const tokens = await this.retrieveSpotifyTokens(code.toString());

        // get user data
        const spotify = new Spotify();
        spotify.setAccessToken(tokens.access_token);
        const user = await spotify.getMe();

        // Set cookie data
        accounts.push({ user, refresh_token: tokens.refresh_token });
        this.$cookies.set("accounts", JSON.stringify(accounts));
        this.$cookies.set("access_token", tokens.access_token);

        // Redirect to app
        this.$router.push("/app");
      })();

      return;
    }

    // If user has previously logged in
    const currentUser = this.$cookies.get("current_user");
    console.log(currentUser);
    if (currentUser) {
      this.$router.push("/app");
      return;
    }

    // Prompt the user to connect to spotify
    if (!accounts || accounts.length === 0) {
      window.location.href = `https://accounts.spotify.com/authorize?${stringifyQuery(
        {
          response_type: "code",
          client_id: client_id,
          scope: scopes.join(" "),
          // state: this.$cookies.get("state"),
          redirect_uri: `${location.origin}/auth`,
        }
      )}`;
    }
  },
  created() {
    this.accounts = JSON.parse(this.$cookies.get("accounts"));
  },
});
</script>

<template>
  <main>
    <div class="login-form">
      <h2 class="login-form-title">Choose an Account to Continue</h2>

      <div class="accounts-list">
        <button
          class="account"
          :key="account.user.id"
          v-for="account in accounts"
          @click="loginUser(account)"
        >
          <img class="account-image" :src="getUserProfileImage(account.user)" />
          <div class="account-info">
            <span class="account-name">{{ account.user.display_name }}</span>
            <span class="account-email">{{ account.user.email }}</span>
          </div>
        </button>
      </div>

      <div class="actions">
        <a href=""></a>
      </div>
    </div>
  </main>
</template>

<style scoped>
.login-form-title {
  font-size: 2.4rem;
  margin-bottom: 3.6rem;
  text-align: center;
}

.login-form {
  padding: 3.6rem 0;
  border-radius: 5px;
  max-height: 80%;
  width: 30%;
  background-color: rgba(255, 255, 255, 0.2);
}

main {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.accounts-list {
  display: flex;
  flex-direction: column;
  border-top: solid 1px grey;
  border-bottom: solid 1px grey;
}

.account {
  display: flex;
  padding: 1.2rem 2.4rem;
  gap: 2.4rem;

  /* Button Styles */
  background: none;
  color: inherit;
  text-align: left;

  transition: background 0.3s;
}

.account:hover,
.account:active {
  background-color: rgba(29, 185, 84, 0.2);
}

.account-info {
  display: flex;
  flex-direction: column;
}

.account-image {
  --size: 5rem;
  width: var(--size);
  height: var(--size);
  border-radius: var(--size);
}

.account-name {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.account-email {
  font-size: 1.4rem;
  color: #cccccc;
}
</style>
