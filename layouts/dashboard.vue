<template>
  <v-app>
    <NuxtLoadingIndicator />
    <TheAppSidebar />
    <TheAppbar />
    <v-main>
      <div class="main-content">
        <slot></slot>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.main-content {
  padding: 4rem 3rem;
}
</style>
