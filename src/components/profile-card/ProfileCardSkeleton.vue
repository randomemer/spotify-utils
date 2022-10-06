<template>
  <div class="card">
    <img class="pfp skeleton" />
    <div class="card-right">
      <h2 class="display-name skeleton"></h2>
      <div class="user-data-field skeleton"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  background-color: gray;
  border-radius: 5px;
  animation: pulse-background 1s infinite;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.4rem;
}

.display-name {
  content: " ";
  height: 2rem;
  width: 16rem;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.2rem;
}

.pfp {
  --size: 10rem;
  border-radius: var(--size);
  height: var(--size);
  width: var(--size);
  object-fit: cover;
}

.user-data-field {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  width: 10rem;
  height: 1.5rem;
}

@keyframes pulse-background {
  0% {
    background-color: gray;
  }

  50% {
    background-color: rgba(128, 128, 128, 0.501);
  }

  100% {
    background-color: gray;
  }
}
</style>
