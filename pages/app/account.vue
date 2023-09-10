<template>
  <NuxtPage></NuxtPage>
</template>

<script setup lang="ts">
definePageMeta({ name: "app:account", middleware: "auth" });
</script>
