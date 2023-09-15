<template>
  <v-layout>
    <TheAppSidebar />
    <TheAppbar />
    <v-main>
      <div class="main-content">
        <slot></slot>
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped>
.main-content {
  padding: 4rem 3rem;
}
</style>
