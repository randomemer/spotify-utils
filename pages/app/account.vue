<template>
  <NuxtLayout name="dashboard"></NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ name: "app:account", middleware: "auth" });
</script>
