<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="nav-bar">
      <span class="logo-title">Spotify Utilities</span>
      <nav>
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/app" class="nav-link">App</RouterLink>
        <RouterLink to="/auth" class="nav-link">Connect Spotify</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  --green: #1db954;
}

html {
  /* font-size: 10px; */
  font-size: 62.5%;
  overflow-x: hidden;
  /* Does NOT work on safari */
  /* scroll-behavior: smooth; */
}

body {
  background-color: #191414;
  color: white;
  line-height: 1;
}

.container {
  /* 1140px */
  max-width: 120rem;
  padding: 0 3.2rem;
  margin: 0 auto;
}

.logo-title {
  font-size: 3rem;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3.5rem 0;
  margin: 0 5rem;
}

nav {
  display: flex;
  justify-content: space-between;
  gap: 5rem;
  font-size: 2rem;
}

.nav-link:link,
.nav-link:visited {
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  color: #1db954;
}
</style>
