<template>
  <div id="app-container" :key="$route.name?.toString()">
    <TheAppSidebar />
    <TheAppbar />
    <div class="main-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --app-bar-height: 4.5rem;
  --sidebar-width: 17.5rem;
}

#app-container {
  padding-left: var(--sidebar-width);
  padding-top: var(--app-bar-height);
}

.main-content {
  padding: 4rem 3rem;
}
</style>
