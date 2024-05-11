<template>
  <div class="error-container">
    <h1>{{ error.statusCode }}</h1>
    <span>{{ error.statusMessage }}</span>
    <DevOnly>
      <div class="stack-trace" v-html="error.stack"></div>
    </DevOnly>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "nuxt/app";

interface ErrorProps {
  error: NuxtError;
}

defineProps<ErrorProps>();
</script>

<style>
.error-container {
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.stack-trace {
  position: relative;
  padding: 1rem;
  border-radius: 0.5rem;
  line-height: 1.25;
  overflow: hidden;

  background-image: linear-gradient(
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.1)
  );
}

.stack-trace::after {
  content: "";
  position: absolute;
  background-color: #ff5722;
  height: 100%;
  top: 0;
  left: 0;
  width: 3px;
}

.stack:not(.internal) {
  color: #ffc107;
}
</style>
