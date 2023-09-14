<template>
  <NuxtLayout name="dashboard">
    <div class="input-wrapper p-input-icon-left">
      <i class="pi">
        <IonIcon :icon="link" />
      </i>
      <InputText placeholder="Enter playlist URL" />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { link } from "ionicons/icons";

definePageMeta({ name: "app:playlists", middleware: "auth" });
</script>

<style scoped lang="scss">
.input-wrapper {
  display: flex;

  :deep(.ionicon) {
    font-size: 1.5rem;
  }
}
</style>
