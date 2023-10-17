<template>
  <Toast v-for="(toast, i) in queue" :key="i" v-bind="toast" />
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const queue = ref<ToastProps[]>([]);

const toast = {
  show(options: ToastProps) {
    queue.value.push(options);
  },
};

nuxtApp.provide("toast", toast);
</script>
