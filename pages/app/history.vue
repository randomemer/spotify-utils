<template>
  <NuxtLayout name="dashboard"></NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ name: "app:history", middleware: "auth" });
</script>
