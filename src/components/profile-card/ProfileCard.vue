<script setup lang="ts">
import Spotify from "spotify-web-api-js";
import { IonIcon } from "@ionic/vue";
import { earth, people } from "ionicons/icons";
import { inject } from "vue";
import type { VueCookies } from "vue-cookies";

const $cookies = inject<VueCookies>("$cookies");
if (!$cookies) throw Error("Couldn't fetch cookies");

const spotify = new Spotify();
spotify.setAccessToken($cookies.get("access_token"));

// const wait = () => new Promise((res) => setTimeout(res, 10000));
// await wait();

const user = await spotify.getMe();
const country = () => {
  const countryName = new Intl.DisplayNames(["en"], { type: "region" });
  return user.country ? countryName.of(user.country) : "";
};
</script>

<template>
  <div class="card">
    <img
      class="pfp"
      :src="
        (user.images && user.images[0]?.url) || '/src/assets/default-pfp.jpeg'
      "
    />

    <div class="card-content">
      <h2 class="display-name">{{ user?.display_name }}</h2>

      <div class="user-data-field">
        <ion-icon :icon="earth" class="user-data-field-icon"></ion-icon>
        <span class="user-data-field-text"> {{ country() }}</span>
      </div>

      <div class="user-data-field">
        <ion-icon :icon="people" class="user-data-field-icon"></ion-icon>
        <span class="user-data-field-text">
          {{ user.followers?.total }} Followers
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  align-items: flex-start;
  gap: 2.4rem;
}

.display-name {
  font-size: 1.8rem;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.2rem;
}

.pfp {
  --size: 6.4rem;
  border-radius: var(--size);
  height: var(--size);
  width: var(--size);
  object-fit: cover;
}

.user-data-field {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.user-data-field-icon {
  font-size: 1.8rem;
  color: #1db954;
}

.user-data-field-text {
  font-size: 1.4rem;
  color: #bbbbbb;
}
</style>
