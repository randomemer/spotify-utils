<template>
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
      <IncomingRequests />
    </v-window-item>

    <v-window-item :value="2">
      <OutgoingRequests />
    </v-window-item>

    <!-- Send Request -->
    <v-window-item :value="3">
      <FriendSearch />
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import FriendSearch from "~/components/friends/FriendSearch.vue";
import FriendsList from "~/components/friends/FriendsList.vue";
import IncomingRequests from "~/components/friends/IncomingRequests.vue";
import OutgoingRequests from "~/components/friends/OutgoingRequests.vue";

definePageMeta({
  name: "app:friends",
  layout: "dashboard",
  middleware: "auth",
});
useHead({ title: "Friends | Music Muse" });

const tab = ref(0);
const router = useRouter();

const QUERY_TABS = ["friends", "incoming", "outgoing", "add"];

watch(
  () => router.currentRoute.value,
  (route) => {
    const tabQuery = route.query.tab;
    if (typeof tabQuery !== "string") return;

    const index = QUERY_TABS.indexOf(tabQuery);
    if (index !== -1) {
      tab.value = index;
      console.log("updated route ", index);
    }
  },
  { immediate: true }
);

watch(
  () => tab.value,
  (newTab, oldTab) => {
    if (newTab === oldTab) return;
    router.push({ query: { tab: QUERY_TABS[newTab] } });
  }
);
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

.spinner-box {
  width: 100%;
  padding: 1rem 0;
  display: flex;
  justify-content: center;

  .spinner {
    margin: 0 auto;
  }
}
</style>
