<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import NetworkImage from "./NetworkImage.vue";

export default defineComponent({
  props: {
    artist: {
      type: Object as PropType<SpotifyApi.ArtistObjectFull>,
      required: true,
    },
  },
  components: { NetworkImage },
});
</script>

<template>
  <div class="artist-item">
    <a :href="artist.external_urls.spotify">
      <NetworkImage
        class="artist-image"
        :src="(artist.images && artist.images.at(-1)?.url) || ''"
        :alt="`${artist.name} Artist Image`"
      />
    </a>
    <div class="artist-info">
      <a class="artist-name" :href="artist.external_urls.spotify">
        <span>{{ artist.name }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.artist-item {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.artist-image {
  $size: 5rem;
  height: $size;
  width: $size;
  border-radius: $size;
  object-fit: cover;
}

.artist-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
}

.artist-name {
  font-size: 1.8rem;
  text-decoration: none;
  color: white;
}

.artist-artists {
  display: flex;
  list-style: none;
  color: #bbb;
  font-size: 1.4rem;

  li + li:before {
    content: ", ";
  }
}
</style>
