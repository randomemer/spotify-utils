<template>
  <NuxtLayout>
    <v-chip-group mandatory v-model="tab" class="tabs" color="primary">
      <v-chip size="large" :value="0" prepend-icon="mdi-account">All</v-chip>
      <v-chip size="large" :value="1" prepend-icon="mdi-account-arrow-left">
        Incoming
      </v-chip>
      <v-chip size="large" :value="2" prepend-icon="mdi-account-arrow-right">
        Outgoing
      </v-chip>
      <v-chip size="large" :value="3" prepend-icon="mdi-account-plus">
        Add Friend
      </v-chip>
    </v-chip-group>

    <v-window v-model="tab">
      <v-window-item :value="0"></v-window-item>
      <v-window-item :value="1"></v-window-item>
      <v-window-item :value="2"></v-window-item>
      <v-window-item :value="3">
        <v-text-field variant="solo-filled" placeholder="Enter Username">
          <template #append-inner>
            <v-btn color="primary">Send Request</v-btn>
          </template>
        </v-text-field>
      </v-window-item>
    </v-window>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  name: "app:friends",
  layout: "dashboard",
  middleware: "auth",
});

const tab = ref(0);
</script>

<style lang="scss">
.tabs {
  margin-bottom: 1.5rem;

  // .v-tab {
  //   font-size: 1rem;
  //   text-transform: none;
  //   letter-spacing: normal;

  //   display: flex;
  //   gap: 0.625rem;
  // }
}
</style>
