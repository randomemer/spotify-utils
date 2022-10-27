<template>
  <div class="card">
    <div class="pfp skeleton"></div>
    <div class="card-right">
      <h2 class="display-name skeleton"></h2>
      <div class="user-data-field skeleton"></div>
    </div>
  </div>
</template>

<style scoped>
@import "./profile-card.css";

.display-name {
  content: " ";
  height: 2rem;
  width: 100%;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.2rem;
  /* width: 100%; */
}

.user-data-field {
  width: 10rem;
  /* width: 75%; */
  height: 1.5rem;
}
</style>
