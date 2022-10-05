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
      <h2 class="display-name heading-secondary">{{ user?.display_name }}</h2>

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
  align-items: center;
  gap: 5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.8rem;
}

.display-name {
  margin-bottom: 1rem;
}

.card-right {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.pfp {
  border-radius: 50rem;
  height: 15rem;
  width: 15rem;
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
