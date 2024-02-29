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
                <v-avatar size="large" :image="friend.picture ?? undefined" />
              </template>
              <template #title>{{ friend.display_name }}</template>
              <template #append>
                <v-btn
                  size="x-large"
                  variant="tonal"
                  color="error"
                  icon="mdi-account-minus"
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
              v-for="(req, i) in friends.incoming"
            >
              <template #prepend>
                <v-avatar
                  size="large"
                  :image="req.profile.picture ?? undefined"
                />
              </template>
              <template #title>{{ req.profile.display_name }}</template>
              <template #append>
                <div class="req-btns">
                  <v-btn
                    variant="tonal"
                    color="success"
                    density="comfortable"
                    icon="mdi-check"
                    @click="acceptFriendReq(req)"
                  />
                  <v-btn
                    variant="tonal"
                    color="error"
                    density="comfortable"
                    icon="mdi-close"
                    @click="deleteFriendReq(req)"
                  />
                </div>
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
                <v-avatar
                  size="large"
                  :image="req.profile.picture ?? undefined"
                />
              </template>
              <template #title>{{ req.profile.display_name }}</template>
              <template #append>
                <v-btn
                  variant="tonal"
                  density="comfortable"
                  color="error"
                  icon="mdi-cancel"
                  @click="deleteFriendReq(req)"
                />
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

      <v-dialog v-model="isUnfriendOpen">
        <v-card>
          <v-card-title></v-card-title>
          <v-card-text> </v-card-text>
          <v-card-actions class="justify-end pa-4">
            <v-btn @click="isUnfriendOpen = false">Cancel</v-btn>
            <v-btn color="error">Unfriend</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { AxiosError } from "axios";

const { $api, $toast } = useNuxtApp();

console.log("toast", $toast);

definePageMeta({
  name: "app:friends",
  layout: "dashboard",
  middleware: "auth",
});
useHead({ title: "Friends | Music Muse" });

const {
  data: friends,
  pending,
  error,
  refresh,
} = useAsyncData(async () => {
  console.time("friends");
  const resp = await $api.get<FriendsListResponse>(`me/friends`);
  console.timeEnd("friends");
  console.log(resp.data);
  return resp.data;
});

const tab = ref(0);
const isSendingReq = ref(false);
const recipient = ref("");

const isUnfriendOpen = ref(false);

async function sendFriendReq() {
  if (isSendingReq.value) return;
  isSendingReq.value = true;
  try {
    const res = await $api.post<FriendReqDocument>(`/friend-requests`, {
      recipient: recipient.value,
    });
    refresh();
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError && error.response?.data) {
      $toast.show({
        message: error.response?.data.message,
        color: "error",
        icon: "mdi-alert-circle",
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
    refresh();
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError && error.response?.data) {
      $toast.show({
        message: error.response?.data.message,
        color: "error",
        icon: "mdi-alert-circle",
      });
    }
  }
}

async function deleteFriendReq(req: IncomingFriendReq | OutgoingFriendReq) {
  try {
    await $api.delete(`friend-requests/${req.id}`);
    refresh();
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError && error.response?.data) {
      $toast.show({
        message: error.response?.data.message,
        color: "error",
        icon: "mdi-alert-circle",
      });
    }
  }
}
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
