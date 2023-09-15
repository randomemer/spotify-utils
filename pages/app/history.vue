<template>
  <NuxtLayout name="dashboard">
    <v-table class="table rounded" :value="history?.items" :loading="pending">
      <thead>
        <tr>
          <th>#</th>
          <th>Track</th>
          <th>Popularity</th>
          <th>Played At</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, i) in tracks">
          <td>{{ i + 1 }}</td>
          <td>
            <TrackItem :track="item.track" />
          </td>
          <td>
            <PopularityIcon
              class="pop-icon"
              :value="item.track.popularity ?? 0"
            />
          </td>
          <td>
            <div class="timestamp">
              <span>
                {{ dayjs(item.played_at, { utc: true }).format("hh:mm:ss A") }}
              </span>
              <span>
                {{ dayjs(item.played_at, { utc: true }).format("MM-DD-YYYY") }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ name: "app:history", middleware: "auth" });

useHead({ title: "History | Music Muse" });

import dayjs from "dayjs";
import useAuthStore from "~/store/auth.store";

const auth = useAuthStore();
const { $spotify } = useNuxtApp();

const {
  data: history,
  error,
  pending,
} = useAsyncData(async () => {
  const query = new URLSearchParams({
    limit: "50",
  });

  const resp = await $spotify.get<SpotifyApi.UsersRecentlyPlayedTracksResponse>(
    `/me/player/recently-played?${query}`
  );
  return resp.data;
});

const tracks = computed(
  () =>
    history?.value?.items.filter((item) => item.track.type === "track") ?? []
);
</script>

<style scoped lang="scss">
.table {
  td {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
  }
}

.pop-icon {
  :deep(.ionicon) {
    font-size: 1.75rem;
  }
}

.timestamp {
  span {
    display: block;
    line-height: 1.5;
  }
}
</style>
