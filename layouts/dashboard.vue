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
import axios, { AxiosError } from "axios";

const {
  status,
  data,
  error: tokenErr,
} = useAsyncData(
  async (ctx) => {
    try {
      const resp = await axios.get("/api/auth/token");
      console.log(resp);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status && [400, 401, 403].includes(status)) {
          await ctx?.$router.replace("/auth/login");
        }
      }
      throw error;
    }
  },
  { server: false }
);
</script>
