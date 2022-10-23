<script lang="ts">
import { defineComponent, type PropType } from "vue";
import TrackItem from "@/components/track/TrackItem.vue";
import ArtistItem from "@/components/ArtistItem.vue";

export default defineComponent({
  components: { TrackItem, ArtistItem },
  props: {
    seeds: {
      required: true,
      // eslint-disable-next-line no-undef
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
        <ArtistItem :artist="seed.item" v-if="seed.type === 'ARTIST'" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
@import "./seeds-source.css";
</style>
