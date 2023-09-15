<template>
  <div class="container">
    <v-card class="card">
      <v-card-title>
        <p class="text-center">Hang tight!</p>
      </v-card-title>

      <v-card-text
        class="d-flex flex-column align-center py-2"
        style="gap: 1rem"
      >
        <v-progress-circular indeterminate class="spinner" color="primary" />
        <p>You will be redirected in a couple of seconds</p>
      </v-card-text>
    </v-card>
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
  padding: 1rem 0;
  width: 25rem;
}

.spinner {
  $size: 2.5rem;
  width: $size;
  height: $size;
}
</style>
