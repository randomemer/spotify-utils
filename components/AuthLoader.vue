<template>
  <div class="container">
    <v-card>
      <div class="card-content">
        <v-progress-circular indeterminate color="primary" />
        <p class="text-body1 font-weight-regular text-center">Hang tight!</p>
        <p class="text-body1 font-weight-regular text-center">
          You will be redirected in a couple of seconds
        </p>
      </div>
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

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 25rem;
  height: 16rem;
  padding: 3rem;
  align-items: center;
  justify-content: center;
}
</style>
