<script setup lang="ts">
defineProps({
  popularity: { type: Number, required: true },
});
</script>

<template>
  <div class="track-popularity">
    <div class="bar-track">
      <div class="bar-fill" :style="{ width: `${Number(popularity)}%` }"></div>
    </div>
    <span>{{ popularity }}%</span>
  </div>
</template>

<style scoped lang="scss">
.track-popularity {
  display: flex;
  align-items: center;
  gap: 10px;

  .bar-track {
    width: 10rem;
    height: 1.4rem;
    background-color: black;
    border-radius: 10rem;
  }

  .bar-fill {
    height: 1.4rem;
    border-radius: 10rem;
    background-color: general.$primary-color;

    transition: width 0.3s;
    width: 0;
  }
}
</style>
