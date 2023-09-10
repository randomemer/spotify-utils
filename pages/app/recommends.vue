<template>
  <NuxtLayout name="dashboard"></NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ name: "app:recommends", middleware: "auth" });
</script>
