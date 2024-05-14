<template>
  <div v-if="pending" class="spinner-box">
    <v-progress-circular indeterminate class="spinner" color="primary" />
  </div>
  <template v-else-if="requests?.length">
    <v-list-item
      :key="i"
      class="list-item"
      variant="flat"
      v-for="(req, i) in requests"
    >
      <template #prepend>
        <v-avatar size="large" :image="req.sender.picture ?? undefined" />
      </template>
      <template #title>{{ req.sender.displayName }}</template>
      <template #append>
        <div class="req-btns">
          <v-btn
            variant="tonal"
            color="success"
            density="comfortable"
            icon="mdi-check"
            @click="accept(req)"
          />
          <v-btn
            variant="tonal"
            color="error"
            density="comfortable"
            icon="mdi-close"
            @click="reject(req)"
          />
        </div>
      </template>
    </v-list-item>
  </template>
  <div v-else class="empty-state">
    <v-icon icon="mdi-information" size="x-large" />
    <span>No incoming requests currently</span>
  </div>
</template>

<script setup lang="ts">
import { AxiosError } from "axios";

const { $api, $toast } = useNuxtApp();

const {
  data: requests,
  pending,
  refresh,
} = useAsyncData(async () => {
  const query = new URLSearchParams({ direction: "incoming" });
  const resp = await $api.get<APIFriendRequest[]>(`/friend-requests?${query}`);
  console.log("incoming requests", resp.data);
  return resp.data;
});

async function accept(req: any) {
  try {
    await $api.get(`/friend-requests/${req.id}/accept`);
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

async function reject(req: APIFriendRequest) {
  try {
    await $api.delete(`/friend-requests/${req.id}`);
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

<style></style>
