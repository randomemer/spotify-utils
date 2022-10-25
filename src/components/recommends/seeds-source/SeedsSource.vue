<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { IonIcon } from "@ionic/vue";
import { musicalNotes } from "ionicons/icons";
import TrackItem from "@/components/track/TrackItem.vue";
import ArtistItem from "@/components/ArtistItem.vue";

export default defineComponent({
  components: { TrackItem, ArtistItem, IonIcon },
  data() {
    return { musicalNotes };
  },
  props: {
    seeds: {
      required: true,

      type: Object as PropType<SpotifyApi.RecommendationsSeedObject[]>,
    },
  },
});
</script>

<template>
  <div>
    <h3>Generated From</h3>
    <ul class="seeds-list">
      <li v-for="seed in seeds" :key="seed.id">
        <TrackItem :track="seed.item" v-if="seed.type === 'TRACK'" />
        <ArtistItem :artist="seed.item" v-else-if="seed.type === 'ARTIST'" />
        <div class="genre-seed-text" v-else>
          <div class="genre-seed-icon">
            <ion-icon :icon="musicalNotes" />
          </div>
          <span>{{ seed.id }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@import "./seeds-source.css";

.genre-seed-text {
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 1.8rem;
}

.genre-seed-icon {
  color: var(--primary-font-color);
  --size: 5rem;
  height: var(--size);
  width: var(--size);
  display: flex;
  align-items: center;
  justify-content: center;
}

.genre-seed-text ion-icon {
  font-size: 3rem;
}
</style>
