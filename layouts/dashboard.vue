<template>
  <v-layout>
    <TheAppSidebar />
    <TheAppbar />
    <v-main>
      <slot></slot>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import useAuthStore from "~/store/auth.store";

const authStore = useAuthStore();

// const { data: tokens, error } = useAsyncData(async (ctx) => {
//   try {
//     if (process.server) {
//       const { fetchSession } = await import("~/server/utils/session");
//       const rawCookies = header.cookie;
//       console.log("cookies", rawCookies);

//       if (!rawCookies) {
//         await callWithNuxt(ctx!, navigateTo, [
//           "/auth/login",
//           { replace: true },
//         ]);
//         return;
//       }

//       const cookies = cookie.parse(rawCookies!);
//       const res = await fetchSession(
//         ctx?.ssrContext?.runtimeConfig! as any,
//         cookies.session_id
//       );
//       return res;
//     } else {
//       if (!tokens.value) {
//         await ctx?.$router.push("/auth/login");
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     if (error instanceof AxiosError) {
//       const status = error.response?.status;
//       if (status && [400, 401, 403].includes(status)) {
//         await ctx?.$router.replace("/auth/login");
//       }
//     }
//     throw error;
//   }
// });

// console.log("err", error.value);

watch(
  () => authStore.token,
  (val) => {
    console.log(val);
  },
  { immediate: true }
);
</script>
