<template>
  <div class="container">
    <Card class="card">
      <template #title>
        <p>Hang tight!</p>
      </template>
      <template #content>
        <ProgressSpinner class="spinner" stroke-width="4" />
      </template>
      <template #footer>
        <p>You will be redirected in a couple of seconds</p>
      </template>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.container {
  position: fixed;
  display: flex;
  height: 100%;
  width: 100%;

  align-items: center;
  justify-content: center;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;

  width: 25rem;

  :deep(.p-card-body) {
    text-align: center;
  }

  :deep(.p-card-content) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.spinner {
  $size: 2.5rem;
  stroke-width: 500;
  width: $size;
  height: $size;

  :deep(.p-progress-circle) {
    color: var(--primary-color);
  }
}
</style>
