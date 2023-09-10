<template>
  <NuxtPage></NuxtPage>
</template>

<script setup lang="ts">
definePageMeta({ name: "app:playlists", middleware: "auth" });
</script>
