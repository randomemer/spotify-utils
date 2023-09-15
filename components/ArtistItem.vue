<template>
  <div class="artist-item">
    <div class="artist-image">
      <img :src="artistImage" :alt="artist.name" />
    </div>
    <div class="artist-details">
      <span class="text-body-1">{{ artist.name }}</span>
      <ul class="artist-genres text-body-2">
        <li :key="genre" v-for="genre in artist.genres.slice(0, 3)">
          <span>{{ genre }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ArtistItemProps {
  artist: SpotifyApi.ArtistObjectFull;
}

const props = defineProps<ArtistItemProps>();

const artistImage = computed(() => props.artist.images.at(-1)?.url);
</script>

<style scoped lang="scss">
.artist-item {
  display: flex;
  gap: 1rem;
}

.artist-image {
  border-radius: 999px;
  overflow: clip;

  img {
    $size: 3rem;
    width: $size;
    height: $size;
    object-fit: cover;
  }
}

.artist-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  line-height: 1.5;
}

.artist-genres {
  display: flex;
  list-style: none;
  color: var(--text-color-secondary);

  li + li::before {
    content: ", ";
  }
}
</style>
