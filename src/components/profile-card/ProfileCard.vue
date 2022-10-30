<script lang="ts">
import { IonIcon } from "@ionic/vue";
import { earth, people } from "ionicons/icons";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  components: { IonIcon },
  props: {
    user: {
      required: true,
      type: Object as PropType<SpotifyApi.CurrentUsersProfileResponse>,
    },
  },
  setup() {
    return { earth, people };
  },
  methods: {
    country() {
      const countryName = new Intl.DisplayNames(["en"], { type: "region" });
      return this.user.country ? countryName.of(this.user.country) : "";
    },
  },
});
</script>

<template>
  <div class="card">
    <div>
      <img
        class="pfp"
        :src="
          (user.images && user.images[0]?.url) || '/src/assets/default-pfp.jpeg'
        "
      />
    </div>

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
@import "./profile-card.css";

.pfp {
  border-radius: 100rem;
  object-fit: cover;
  max-width: 100%;
  max-height: 100%;
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

.user-data-field-icon {
  font-size: 1.8rem;
  color: var(--primary-font-color);
}

.user-data-field-text {
  font-size: 1.4rem;
  color: #bbbbbb;
}
</style>
