<template>
  <NuxtLayout></NuxtLayout>
</template>

<script setup lang="ts">
import useCacheStore from "~/store/cache.store";

definePageMeta({
  name: "app:recommends:id",
  layout: "dashboard",
  middleware: "auth",
});

useHead({ title: "Recommends | Music Muse" });

const route = useRoute();
const { $api } = useNuxtApp();
const cache = useCacheStore();

const { data } = useAsyncData(async () => {
  const id = route.params.id as string;

  const cached = cache.getCachedRecommend(id);
  console.log("wwas cached");
  if (cached) return cached;

  const resp = await $api.get<RecommendsDataFull>("/recommends/" + id);
  return resp.data;
});

watchEffect(() => {
  console.log("data", data.value);
});
</script>
