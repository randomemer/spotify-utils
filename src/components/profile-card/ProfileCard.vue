<script lang="ts">
import Spotify from "spotify-web-api-js";
import { defineComponent } from "vue";
import { IonIcon } from "@ionic/vue";
import { earth, people } from "ionicons/icons";

export default defineComponent({
  components: { IonIcon },
  setup() {
    return { earth, people };
  },
  data() {
    return {
      // eslint-disable-next-line no-undef
      user: {} as SpotifyApi.CurrentUsersProfileResponse,
      spotify: new Spotify(),
    };
  },
  computed: {
    country() {
      const countryName = new Intl.DisplayNames(["en"], { type: "region" });
      return this.user.country ? countryName.of(this.user.country) : "";
    },
  },
  methods: {
    async fetchUserProfile(): Promise<void> {
      try {
        this.user = await this.spotify.getMe();
      } catch (error) {
        console.warn(error);
      }
    },
  },
  mounted() {
    this.spotify.setAccessToken(this.$cookies.get("access_token"));
    this.fetchUserProfile();
  },
});
</script>

<template>
  <div class="card">
    <img
      class="pfp"
      :src="
        (user.images && user.images[0].url) || 'src/assets/default-pfp.jpeg'
      "
    />

    <div class="card-right">
      <h2 class="display-name">{{ user?.display_name }}</h2>

      <div class="user-data-field">
        <ion-icon :icon="earth" class="user-data-field-icon"></ion-icon>
        <span class="user-data-field-text"> {{ country }}</span>
      </div>
      <div class="user-data-field">
        <ion-icon :icon="people" class="user-data-field-icon"></ion-icon>
        <span class="user-data-field-text"
          >{{ user.followers?.total }} Followers</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.4rem;
}

.display-name {
  font-size: 2.4rem;
}

.card-right {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.pfp {
  --size: 12rem;
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
  font-size: 2.4rem;
  color: #1db954;
}

.user-data-field-text {
  font-size: 1.6rem;
}
</style>
