<template>
  <v-list-item>
    <template #prepend>
      <v-avatar size="large" icon="mdi-music-note" />
    </template>
    <template #title>{{ genre.genre }}</template>

    <template #append>
      <slot name="append"></slot>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
interface GenreItemProps {
  genre: GenreObject;
}

defineProps<GenreItemProps>();
</script>
