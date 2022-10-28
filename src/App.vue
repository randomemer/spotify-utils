<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>

<style>
@import "@/assets/general.css";

*,
*::before,
*::after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

*:focus {
  outline: none;
  /* box-shadow: 0 0 0 0.4rem rgba(29, 185, 84, 0.5); */
}

html {
  /* font-size: 10px; */
  font-size: 62.5%;
  overflow-x: hidden;
  /* Does NOT work on safari */
  /* scroll-behavior: smooth; */
}

body {
  background-color: var(--background-color);
  color: var(--font-color);
  font-family: "Lexend Deca", sans-serif;
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

select {
  /* A reset of styles, including removing the default dropdown arrow */
  appearance: none;
  /* Additional resets for further consistency */
  background-color: transparent;
  border: none;
  padding: 0 1em 0 0;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
  /* ...existing styles */
  outline: none;
}

select::-ms-expand {
  display: none;
}

input,
.input {
  border: none;
  font-family: inherit;

  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.8rem 1.6rem;
}

button {
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.button {
  border: none;
  cursor: pointer;
  font-family: inherit;
  background-color: var(--primary-color);
  color: var(--font-color);
  padding: 0.8rem 1.6rem;
  border-radius: 1000px;
}

.link:link,
.link:visited {
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  color: inherit;
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

.skeleton {
  background-color: gray;
  border-radius: 5px;
  animation: pulse-background 1.5s infinite;
}

@keyframes pulse-background {
  0% {
    background-color: gray;
  }

  50% {
    background-color: rgba(128, 128, 128, 0.5);
  }

  100% {
    background-color: gray;
  }
}

ion-icon {
  display: flex;
  align-items: center;
}
</style>
