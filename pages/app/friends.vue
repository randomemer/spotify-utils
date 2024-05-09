<template>
  <div>
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
        <v-window-item :value="0">
          <FriendsList />
        </v-window-item>

        <v-window-item :value="1">
          <FriendsIncomingRequests />
        </v-window-item>

        <v-window-item :value="2"><OutgoingRequests /> </v-window-item>

        <!-- Send Request -->
        <v-window-item :value="3">
          <FriendSearch />
        </v-window-item>
      </v-window>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();

console.log("toast", $toast);

definePageMeta({
  name: "app:friends",
  layout: "dashboard",
  middleware: "auth",
});
useHead({ title: "Friends | Music Muse" });

const tab = ref(0);
</script>

<style lang="scss">
.tabs {
  margin-bottom: 1.5rem;
}

.list-item {
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 5px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  height: 12.5rem;
}

.req-btns {
  display: flex;
  gap: 0.5rem;
}
</style>
