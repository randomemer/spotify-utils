<template>
  <NuxtLayout> </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  name: "app:friends",
  layout: "dashboard",
  middleware: "auth",
});
</script>
