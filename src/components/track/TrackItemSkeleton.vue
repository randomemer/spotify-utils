<script setup lang="ts">
import _ from "lodash";

const randomLength = (start: number, end: number) =>
  `${_.random(start, end, true)}rem`;

const randomCount = (start: number, end: number) => _.random(start, end);
</script>

<template>
  <div class="track-item">
    <div class="track-image skeleton"></div>
    <div class="track-info">
      <span
        class="skeleton"
        :style="{ height: '1.6rem', width: randomLength(10, 20) }"
      ></span>
      <ul class="track-artists">
        <li
          class="skeleton"
          v-for="(artist, i) in Array(randomCount(1, 3))"
          :key="i"
          :style="{ height: '1.2rem', width: randomLength(6, 10) }"
        ></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
@import "./track.css";

.track-info {
  text-align: start;
  gap: 10px;
}

.track-artists {
  gap: 8px;
}
</style>
