<template>
  <v-text-field
    v-model="recipient"
    variant="solo-filled"
    placeholder="Enter Username"
  >
    <template #append-inner>
      <v-btn :loading="isSendingReq" color="primary" @click="sendFriendReq()">
        Send Request
      </v-btn>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import { AxiosError } from "axios";
import type { InsertFriendRequestModel } from "~/types/server";

const { $api, $toast } = useNuxtApp();

const isSendingReq = ref(false);
const recipient = ref("");

async function sendFriendReq() {
  if (isSendingReq.value) return;
  isSendingReq.value = true;
  try {
    const res = await $api.post<InsertFriendRequestModel>(`/friend-requests`, {
      recipient: recipient.value,
    });
    // refresh();
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
</script>

<style></style>
