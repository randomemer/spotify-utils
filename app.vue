<template>
  <NuxtPage />
</template>

<script setup lang="ts">
const appConfig = useAppConfig();

onServerPrefetch(() => {
  appConfig.webOrigin = process.dev
    ? `http://localhost:4009`
    : `https://${process.env.VERCEL_DOMAIN}`;
});
</script>

<style lang="scss">
@import "assets/css/primevue-sass-theme-3.34.1/themes/material/material-dark/standard/deeppurple/theme.scss";

/* Box sizing rules */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Set core root defaults */
html:focus-within {
  scroll-behavior: smooth;
  overflow-x: hidden;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1;
  overflow-x: hidden;
}

a {
  text-decoration: none;
  color: inherit;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}

/* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
