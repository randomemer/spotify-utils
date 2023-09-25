<template>
  <NuxtLayout></NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  name: "app:recommends:id",
  layout: "dashboard",
  middleware: "auth",
});

useHead({ title: "Recommends | Music Muse" });

const route = useRoute();
const { $api } = useNuxtApp();

const { data } = useAsyncData(async () => {
  const id = route.params.id as string;

  // @TODO: add pinia store checking

  const resp = await $api.get<RecommendsData>("/recommends/" + id);

  // const { getAdmin };
});
</script>
