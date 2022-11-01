<script lang="ts">
import { defineComponent, type PropType } from "vue";
import TrackItem from "@/components/track/TrackItem.vue";
import ArtistItem from "@/components/ArtistItem.vue";
import GenreItem from "@/components/GenreItem.vue";

export default defineComponent({
  components: { TrackItem, ArtistItem, GenreItem },
  props: {
    seeds: {
      required: true,
      type: Object as PropType<RecommendationsSeedObject[]>,
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
        <GenreItem :genre="seed.item" v-else />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@import "./seeds-source.scss";
</style>
