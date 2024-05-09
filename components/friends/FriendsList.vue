<template>
  <template v-if="friends?.length">
    <v-list-item
      :key="i"
      class="list-item"
      variant="flat"
      v-for="(friend, i) in friends"
    >
      <template #prepend>
        <v-avatar size="large" :image="friend.picture ?? undefined" />
      </template>
      <template #title>{{ friend.displayName }}</template>
      <template #append>
        <v-btn
          variant="tonal"
          density="comfortable"
          color="error"
          icon="mdi-account-minus"
          @click="openUnfriendDialog(friend)"
        />
      </template>
    </v-list-item>
  </template>
  <div v-else class="empty-state">
    <v-icon icon="mdi-information" size="x-large" />
    <span>You don't have any friends yet!</span>
  </div>

  <!-- Unfriend Dialog -->
  <v-dialog max-width="37.5rem" v-model="isUnfriendOpen">
    <v-card>
      <v-card-text>
        Are you sure you want to unfriend
        <strong>{{ unfriend?.displayName }}</strong
        >?
      </v-card-text>
      <v-card-actions class="justify-end pa-4">
        <v-btn @click="isUnfriendOpen = false">Cancel</v-btn>
        <v-btn color="error" @click="unfriendUser()">Unfriend</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { AxiosError } from "axios";
import type { SelectUser } from "~/server/database/schema";

const { $api, $toast } = useNuxtApp();

const {
  data: friends,
  pending,
  refresh,
} = useAsyncData(async () => {
  const resp = await $api.get("/me/friends");
  console.log("my friends", resp.data);
  return resp.data;
});

const isUnfriendOpen = ref(false);
const unfriend = ref<SelectUser | null>(null);

function openUnfriendDialog(user: SelectUser) {
  unfriend.value = user;
  isUnfriendOpen.value = true;
}

async function unfriendUser() {
  try {
    await $api.delete(`me/friends/${unfriend.value?.id}`);
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
  isUnfriendOpen.value = false;
}
</script>
