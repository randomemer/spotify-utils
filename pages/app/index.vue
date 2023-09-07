<template>
  <NuxtLayout name="dashboard">a</NuxtLayout>
</template>

<script setup lang="ts">
import cookie from "cookie";

useAsyncData(async (ctx) => {
  try {
    if (process.server) {
      const { fetchSession } = await import("~/server/utils/session");
      console.log("server");
      console.log(ctx?.ssrContext?.event.headers.get("cookie"));
      const rawCookies = ctx?.ssrContext?.event.headers.get("cookie")!;
      const cookies = cookie.parse(rawCookies);

      const res = await fetchSession(
        ctx?.ssrContext?.runtimeConfig! as any,
        cookies.session_id
      );
      console.log("YEAH MATAFNAFACKA", res);
    } else {
      console.log("client");
    }
  } catch (err) {
    console.error(err);
  }
});

console.log();
</script>
