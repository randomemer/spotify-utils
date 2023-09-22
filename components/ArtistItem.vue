<template>
  <v-list-item class="artist-item">
    <template #prepend>
      <v-avatar size="large" :image="artistImage" />
    </template>

    <template #title>{{ artist.name }}</template>
    <template #subtitle>
      <ul class="artist-genres text-body-2">
        <li :key="genre" v-for="genre in artist.genres.slice(0, 3)">
          <span>{{ genre }}</span>
        </li>
      </ul>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
interface ArtistItemProps {
  artist: ArtistItemData;
}

const props = defineProps<ArtistItemProps>();

const artistImage = computed(() => props.artist.images.at(-1)?.url);
</script>

<style scoped lang="scss">
.artist-genres {
  display: flex;
  list-style: none;

  li + li::before {
    content: ", ";
  }
}
</style>

<style>
.artist-item {
  line-height: 1.5;
}
</style>
