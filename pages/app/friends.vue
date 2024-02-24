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
        <!-- All friends -->
        <v-window-item :value="0"></v-window-item>

        <!-- Incoming Requests -->
        <v-window-item :value="1"></v-window-item>

        <!-- Outgoing requests -->
        <v-window-item :value="2">
          <v-list-item v-for="(req, i) in data?.outgoing" :key="i">
            <template #prepend>
              <!-- <v-avatar :image="" /> -->
            </template>
          </v-list-item>
        </v-window-item>

        <!-- Send Request -->
        <v-window-item :value="3">
          <v-text-field
            v-model="recipient"
            variant="solo-filled"
            placeholder="Enter Username"
          >
            <template #append-inner>
              <v-btn
                :loading="isSendingReq"
                color="primary"
                @click="sendFriendReq()"
              >
                Send Request
              </v-btn>
            </template>
          </v-text-field>
        </v-window-item>
      </v-window>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import useUserStore from "~/store/user.store";

const { $api } = useNuxtApp();
const { session } = useUserStore();

definePageMeta({
  name: "app:friends",
  layout: "dashboard",
  middleware: "auth",
});
useHead({ title: "Friends | Music Muse" });

const { data, error } = useAsyncData(async () => {
  console.time("friends");
  const resp = await $api.get<FriendsListResponse>(
    `user/${session?.kv_data.user_id}/friends`
  );
  console.timeEnd("friends");
  console.log(resp.data);
  return resp.data;
});

const tab = ref(0);
const isSendingReq = ref(false);
const recipient = ref("");

async function sendFriendReq() {
  if (isSendingReq.value) return;
  isSendingReq.value = true;
  try {
    const res = await $api.post<FriendReqDocument>(
      `/user/${session?.kv_data.user_id}/friends`,
      {
        recipient: recipient.value,
      }
    );
    console.log("res", res.data);
  } catch (error) {
    console.error(error);
  }
  isSendingReq.value = false;
}
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
