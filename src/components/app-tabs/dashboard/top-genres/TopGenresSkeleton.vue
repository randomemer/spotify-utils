<template>
  <div class="card">
    <h3 class="heading-tertiary">Your Top Genres</h3>

    <div class="summary">
      <p class="skeleton"></p>
      <p class="skeleton"></p>
    </div>

    <div class="canvas-area">
      <div class="donut-chart skeleton"></div>
      <div class="legend">
        <span
          class="legend-label skeleton"
          v-for="(_, i) in Array(5)"
          :key="i"
        ></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;

  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2.4rem;
}

.card * {
  transition: all 0.3s;
}

.summary p {
  --text-height: 1.6rem;
  height: var(--text-height);
  margin-bottom: calc(var(--text-height) * 0.8);
}

.canvas-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.donut-chart {
  --size: 25.6rem;
  width: var(--size);
  height: var(--size);
  border-radius: calc(var(--size) / 2);
}

.legend {
  display: flex;
  /* width: auto; */
  align-items: stretch;
  flex-direction: column;
  gap: 1.4rem;
  width: 40%;
}

.legend-label {
  height: 1.4rem;
  width: 100%;
}
</style>
