<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="nav-bar">
      <span class="logo-title">Spotify Utilities</span>
      <nav>
        <RouterLink to="/" class="nav-link link">Home</RouterLink>
        <RouterLink to="/app" class="nav-link link">App</RouterLink>
        <RouterLink to="/auth" class="nav-link link"
          >Connect Spotify</RouterLink
        >
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style>
@font-face {
  font-family: "Gotham", sans-serif;
  src: url("@/assets/gotham.otf");
}

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
  font-family: "Gotham";
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

button {
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-link:link,
.nav-link:visited {
  font-size: 1.8rem;
  color: #1db954;
  text-transform: uppercase;
}

.link:link,
.link:visited {
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
}

.heading-primary,
.heading-secondary,
.heading-tertiary {
  font-weight: 700;
  letter-spacing: -0.5px;
}

.heading-primary {
  font-size: 5.2rem;
  line-height: 1.05;
}

.heading-secondary {
  font-size: 4.4rem;
  line-height: 1.2;
}

.heading-tertiary {
  font-size: 3rem;
  line-height: 1.2;
}

input {
  border: none;
  font-family: inherit;
  color: inherit;
}

*:focus {
  outline: none;
  box-shadow: 0 0 0 0.4rem rgba(29, 185, 84, 0.5);
}
</style>
