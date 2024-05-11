<template>
  <template v-if="requests?.length">
    <v-list-item
      :key="i"
      class="list-item"
      variant="flat"
      v-for="(req, i) in requests"
    >
      <template #prepend>
        <v-avatar size="large" :image="req.recipient.picture ?? undefined" />
      </template>
      <template #title>{{ req.recipient.displayName }}</template>
      <template #append>
        <v-btn
          variant="tonal"
          density="comfortable"
          color="error"
          icon="mdi-cancel"
          @click="cancel(req)"
        />
      </template>
    </v-list-item>
  </template>
  <div v-else class="empty-state">
    <v-icon icon="mdi-information" size="x-large" />
    <span>No outgoing requests currently</span>
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
  const query = new URLSearchParams({ direction: "outgoing" });
  const resp = await $api.get<APIFriendRequest[]>(`/friend-requests?${query}`);
  return resp.data;
});

async function cancel(req: any) {
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
