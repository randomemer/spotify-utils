<template>
  <NuxtLoadingIndicator />
  <TheAppSidebar />
  <TheAppbar />
  <v-main>
    <div class="main-content">
      <slot></slot>
    </div>
  </v-main>
</template>

<style scoped>
.main-content {
  padding: 4rem 3rem;
}
</style>
