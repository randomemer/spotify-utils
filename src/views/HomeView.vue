<template>
  <header>
    <div class="nav-bar">
      <span class="logo-title">Spotify Utilities</span>
    </div>
  </header>

  <main>
    <section class="hero-section page-section">
      <h1 class="hero-title">
        Why wait for spotify wrapped? <br />
        Know it all now.
      </h1>

      <RouterLink to="/auth" class="cta-button link">
        Login with Spotify
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.nav-bar {
  display: flex;
  /* justify-content: space-between; */
  justify-content: center;
  align-items: center;
  padding: 3.5rem 0;
  margin: 0 5rem;
}

.logo-title {
  text-transform: uppercase;
}

.nav-link:link,
.nav-link:visited {
  font-size: 1.8rem;
  color: #1db954;
  text-transform: uppercase;
}

.page-section {
  max-width: 120rem;
  margin: 0 auto;
}

.hero-section {
  padding: 6.4rem;
}

.hero-title {
  font-size: 4.8rem;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 1.5;
  margin-bottom: 6.4rem;
}

.cta-button:link,
.cta-button:visited {
  background-color: var(--primary-color);
  padding: 1.6rem 3.2rem;
  font-size: 1.8rem;
  border-radius: 100rem;
  transition: background 0.3s;
}

.cta-button:active,
.cta-button:hover {
  background-color: #12642f;
}
</style>
