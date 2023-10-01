<template>
  <v-card class="seeds-card">
    <v-card-title>Seeds</v-card-title>
    <v-card-text>
      <v-list class="seeds-list">
        <div class="seed-item" :key="item.id" v-for="item in seeds">
          <TrackItem v-if="item.type === `track`" :track="item" />
          <ArtistItem v-else-if="item.type === `artist`" :artist="item" />
          <GenreItem v-else-if="item.type === `genre`" :genre="item" />
        </div>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface SeedsCardProps {
  seeds: SeedSearchResult[];
}

const props = defineProps<SeedsCardProps>();
</script>

<style scoped lang="scss">
.seeds-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.seed-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;

  :deep(.v-list-item) {
    padding: 0;
  }
}

.seeds-card :deep(.v-card-text) {
  padding-bottom: 0;
}
</style>
