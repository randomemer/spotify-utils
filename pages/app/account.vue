<template>
  <div>
    <NuxtLayout name="dashboard">
      <v-card class="profile-card pa-6">
        <v-btn
          color="primary"
          icon
          width="128"
          height="128"
          v-on:mouseover="isHoveringPfp = true"
          v-on:mouseout="isHoveringPfp = false"
        >
          <v-avatar size="128" :image="pfp" />
          <v-icon
            icon="mdi-pencil"
            class="avatar-edit-icon"
            v-show="isHoveringPfp"
          />
        </v-btn>

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
                :disabled="username === profile?.username"
                @click="saveUsername()"
              />
            </template>
          </v-text-field>
        </div>
      </v-card>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import useUserStore from "~/store/user.store";

const { $api } = useNuxtApp();
const { profile, session } = useUserStore();

definePageMeta({ name: "app:account", middleware: "auth" });

const username = ref(profile?.username);
const isSavingUsername = ref(false);
const isHoveringPfp = ref(false);

const pfp = computed(() => profile?.picture ?? undefined);
const name = computed(() => profile?.display_name);
const createdAt = computed(() =>
  dayjs(profile?.created_at, { utc: true }).format("d MMM YYYY")
);

async function saveUsername() {
  if (isSavingUsername.value) return;
  isSavingUsername.value = true;

  try {
    const newUsername = username.value!.trim();
    await $api.patch(`user/${session?.kv_data.user_id}`, {
      username: newUsername,
    });
    profile!.username = newUsername;
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

.avatar-edit-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
