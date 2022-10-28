<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { musicalNotes } from "ionicons/icons";

defineProps({
  genre: { type: String, required: true },
});
</script>

<template>
  <div class="genre-item">
    <div class="genre-seed-icon">
      <ion-icon :icon="musicalNotes" />
    </div>
    <span>{{ genre }}</span>
  </div>
</template>

<style scoped>
.genre-item {
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

.genre-item ion-icon {
  font-size: 3rem;
}
</style>
