<template>
  <NuxtPage></NuxtPage>
</template>

<script setup>
// import { fetchSession } from "~/server/utils/session";

// const { data, error } = useAsyncData(async (nuxtApp) => {
//   if (process.server) {
//     const ctx = nuxtApp.ssrContext;
//     return await fetchSession(ctx.event);
//   } else {
//     console.log("to be implemented");
//   }
// });
const { data, error } = useFetch("/api/auth/token");

console.log(data.value, error.value);
</script>
