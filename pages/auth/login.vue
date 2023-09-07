<template>
  <AuthLoader />
</template>

<script setup lang="ts">
import axios from "axios";

useAsyncData(
  async (ctx) => {
    const resp = await axios.get("/api/auth/login");

    switch (resp.status) {
      case 200:
        if (resp.data.status === "redirect") {
          console.log(resp.data);
          window.location.href = resp.data.url;
        }
        break;

      case 204:
        if (resp.status == 204) {
          await ctx?.$router.push("/app");
        }
        break;

      default:
        break;
    }
  },
  { server: false }
);
</script>
