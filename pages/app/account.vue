<template>
  <NuxtLayout name="dashboard">
    <v-card class="profile-card pa-6">
      <v-avatar size="128" :image="pfp" />

      <div class="right">
        <h2>{{ name }}</h2>

        <div class="created-at">
          <v-icon icon="mdi-calendar-account" />
          <span>Member since {{ createdAt }}</span>
        </div>

        <v-text-field
          v-model="username"
          type="text"
          color="primary"
          variant="solo-filled"
          density="compact"
          label="Username"
          :disabled="isSavingUsername"
          :loading="isSavingUsername"
        >
          <template #append-inner>
            <v-btn
              color="primary"
              variant="text"
              icon="mdi-content-save-edit"
              :disabled="username === user?.username"
              @click="saveUsername()"
            />
          </template>
        </v-text-field>
      </div>
    </v-card>
  </NuxtLayout>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import useUserStore from "~/store/user.store";

const { $api } = useNuxtApp();
const userStore = useUserStore();

definePageMeta({ name: "app:account", middleware: "auth" });

const { data: user } = useAsyncData(async () => {
  const id = userStore.spotifyProfile?.id;
  console.log("current user", id);
  const resp = await $api.get<UserDocument>(`user/${id}`);
  return resp.data;
});

const createdAt = computed(() =>
  dayjs(user.value?.created_at, { utc: true }).format("d MMM YYYY")
);

const pfp = computed(() => userStore.spotifyProfile?.images?.at(-1)?.url);
const name = computed(() => user.value?.display_name);

const username = ref(user.value?.username);
const isSavingUsername = ref(false);

async function saveUsername() {
  if (isSavingUsername.value) return;
  isSavingUsername.value = true;

  try {
    const newUsername = username.value!.trim();
    await $api.patch(`user/${userStore.spotifyProfile?.id}`, {
      username: newUsername,
    });
    user.value!.username = newUsername;
  } catch (error) {
    // Show error message
    console.error(error);
  }

  isSavingUsername.value = false;
}
</script>

<style scoped lang="scss">
.profile-card {
  display: flex;
  gap: 1.8rem;

  .right {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 1.2rem;

    .created-at {
      display: flex;
      gap: 0.625rem;
      align-items: center;
    }
  }
}
</style>
