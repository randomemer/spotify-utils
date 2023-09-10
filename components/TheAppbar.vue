<template>
  <div id="app-bar">
    <Button text rounded icon="pi" class="avatar-btn">
      <Avatar shape="circle" :image="pfp" />
    </Button>
  </div>
</template>

<script setup lang="ts">
const { $spotify } = useNuxtApp();

const { data: profile, error } = useAsyncData(async (ctx) => {
  const resp = await $spotify.get<SpotifyApi.CurrentUsersProfileResponse>(
    "/me"
  );
  return resp.data;
});

const pfp = computed(() => profile.value?.images?.at(-1)?.url);
</script>

<style scoped lang="scss">
#app-bar {
  position: fixed;
  top: 0;
  right: 0;
  left: var(--sidebar-width);

  display: flex;
  padding: 0.75rem 3rem;
  height: var(--app-bar-height);

  background-color: var(--surface-f);

  /* Apply a shadow effect to the app bar on the bottom and right sides */
  box-shadow: 0 4px 6px -3px rgba(0, 0, 0, 0.2),
    0 0 16px 2px rgba(0, 0, 0, 0.14), 0 3px 18px 4px rgba(0, 0, 0, 0.12);
  z-index: 1101;
}

.avatar-btn {
  margin-inline-start: auto;
  padding: 0 !important;
}
</style>
