<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  created() {
    this.$cookies.set("state", "guest");
    console.log(location.origin);
    console.log(this.$cookies.keys());
  },
});
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
</template>

<style scoped>
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
  font-size: 1.8rem;
  color: #1db954;
  text-transform: uppercase;
}
</style>
