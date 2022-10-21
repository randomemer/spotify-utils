<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  props: {
    track: {
      required: true,
      // eslint-disable-next-line no-undef
      type: Object as PropType<SpotifyApi.TrackObjectFull>,
    },
  },
});
</script>

<template>
  <div class="track-item">
    <a :href="track.external_urls.spotify">
      <img class="track-image" :src="track.album.images[0].url" />
    </a>
    <div class="track-info">
      <a class="track-name" :href="track.external_urls.spotify">
        <span>{{ track.name }}</span>
      </a>
      <ul class="track-artists">
        <li v-for="artist in track.artists" :key="artist.id">
          {{ artist.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.track-item {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.track-image {
  --size: 5rem;
  height: var(--size);
  width: var(--size);
  border-radius: var(--size);
  object-fit: cover;
}

.track-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
}

.track-name {
  font-size: 1.8rem;
  text-decoration: none;
  color: white;
}

.track-artists {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  color: #bbb;
  font-size: 1.4rem;
}

.track-artists li + li:before {
  content: ", ";
}
</style>
