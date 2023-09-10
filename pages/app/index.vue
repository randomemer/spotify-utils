<template>
  <NuxtLayout name="dashboard">
    <v-container class="pa-0">
      <v-row>
        <v-col><DashboardTopGenres /></v-col>
        <v-col></v-col>
      </v-row>
      <v-row>
        <v-col><DashboardTopTracks /></v-col>
        <v-col><DashboardTopArtists /></v-col>
      </v-row>
    </v-container>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ name: "app", middleware: "auth", alias: ["/app/dashboard"] });

import DashboardTopGenres from "~/components/dashboard/TopGenres.vue";
import DashboardTopTracks from "~/components/dashboard/TopTracks.vue";
import DashboardTopArtists from "~/components/dashboard/TopArtists.vue";
</script>
