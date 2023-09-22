<template>
  <v-list-item class="track-item">
    <template #prepend>
      <v-avatar size="large" :image="trackImage" />
    </template>

    <template #title>{{ track.name }}</template>
    <template #subtitle>
      <ul class="track-artists">
        <li :key="artist.id" v-for="artist in track.artists">
          <NuxtLink :href="artist.external_urls.spotify" target="_blank">
            {{ artist.name }}
          </NuxtLink>
        </li>
      </ul>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
interface TrackItemProps {
  track: SpotifyApi.TrackObjectFull;
}

const props = defineProps<TrackItemProps>();

const trackImage = computed(() => props.track.album.images.at(-1)?.url);
</script>

<style scoped lang="scss">
.track-artists {
  display: flex;
  list-style: none;

  li + li::before {
    content: ", ";
  }
}
</style>

<style>
.track-item {
  line-height: 1.5;
}
</style>
