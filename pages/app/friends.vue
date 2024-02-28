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
        <v-window-item :value="0">
          <template v-if="friends?.friends.length">
            <v-list-item
              :key="i"
              class="list-item"
              variant="flat"
              v-for="(friend, i) in friends.friends"
            >
              <template #prepend>
                <v-avatar size="large" :image="friend.picture" />
              </template>
              <template #title>{{ friend.display_name }}</template>
              <template #append>
                <v-btn
                  size="x-large"
                  variant="tonal"
                  color="error"
                  icon="mdi-cancel"
                />
              </template>
            </v-list-item>
          </template>
          <div v-else class="empty-state">
            <v-icon icon="mdi-information" size="x-large" />
            <span>You don't have any friends yet!</span>
          </div>
        </v-window-item>

        <!-- Incoming Requests -->
        <v-window-item :value="1">
          <template v-if="friends?.incoming.length">
            <v-list-item
              :key="i"
              class="list-item"
              variant="flat"
              v-for="(req, i) in friends.outgoing"
            >
              <template #prepend>
                <v-avatar size="large" :image="req.profile.picture" />
              </template>
              <template #title>{{ req.profile.display_name }}</template>
              <template #append>
                <v-btn variant="tonal" color="error" icon="mdi-cancel" />
              </template>
            </v-list-item>
          </template>
          <div v-else class="empty-state">
            <v-icon icon="mdi-information" size="x-large" />
            <span>No incoming requests currently</span>
          </div>
        </v-window-item>

        <!-- Outgoing requests -->
        <v-window-item :value="2">
          <template v-if="friends?.outgoing.length">
            <v-list-item
              :key="i"
              class="list-item"
              variant="flat"
              v-for="(req, i) in friends.outgoing"
            >
              <template #prepend>
                <v-avatar size="large" :image="req.profile.picture" />
              </template>
              <template #title>{{ req.profile.display_name }}</template>
              <template #append>
                <v-btn variant="tonal" color="error" icon="mdi-cancel" />
              </template>
            </v-list-item>
          </template>
          <div v-else class="empty-state">
            <v-icon icon="mdi-information" size="x-large" />
            <span>No outgoing requests currently</span>
          </div>
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
import { AxiosError } from "axios";

const { $api, $toast } = useNuxtApp();

definePageMeta({
  name: "app:friends",
  layout: "dashboard",
  middleware: "auth",
});
useHead({ title: "Friends | Music Muse" });

const { data: friends, error } = useAsyncData(async () => {
  console.time("friends");
  const resp = await $api.get<FriendsListResponse>(`me/friends`);
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
    const res = await $api.post<FriendReqDocument>(`/friend-requests`, {
      recipient: recipient.value,
    });
    console.log("res", res.data);
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      const data = error.response?.data;
      $toast.show({
        message: data.message,
        color: "error",
        queueable: true,
      });
    }
  }
  isSendingReq.value = false;
}

async function acceptFriendReq(req: IncomingFriendReq) {
  try {
    await $api.patch(`friend-requests/${req.id}`, {
      action: "accept",
    });
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
    }
  }
}

async function deleteFriendReq(req: IncomingFriendReq | OutgoingFriendReq) {
  try {
    await $api.delete(`friend-requests/${req.id}`);
  } catch (error) {
    console.error(error);
  }
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
</style>
