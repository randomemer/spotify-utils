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
          @click="input?.click()"
        >
          <v-avatar size="128" :image="pfp" />
          <v-icon
            icon="mdi-pencil"
            class="avatar-edit-icon"
            v-show="isHoveringPfp"
          />
          <input
            ref="input"
            class="img-input"
            type="file"
            accept="image/*"
            @change="onFileChange"
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

      <v-dialog v-model="isCropperOpen" max-width="37.5rem">
        <v-card>
          <v-card-title>Crop Image</v-card-title>
          <v-card-text>
            <VueCropper ref="cropper" :src="selectedImage" :aspect-ratio="1" />
          </v-card-text>
          <v-card-actions class="justify-end pa-4">
            <v-btn @click="isCropperOpen = false">Cancel</v-btn>
            <v-btn
              color="primary"
              :loading="isUploadingPfp"
              @click="onCropAndUpload()"
            >
              Upload
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import "cropperjs/dist/cropper.css";
import dayjs from "dayjs";
import type { VueCropperMethods } from "vue-cropperjs";
import VueCropper from "vue-cropperjs";
import useUserStore from "~/store/user.store";

const { $api } = useNuxtApp();
const userStore = useUserStore();
const { profile, session } = userStore;

definePageMeta({ name: "app:account", middleware: "auth" });
useHead({ title: "Account | Music Muse" });

const username = ref(profile?.username);
const isSavingUsername = ref(false);
const isHoveringPfp = ref(false);

const input = ref<HTMLInputElement | null>(null);
const selectedImage = ref();
const isCropperOpen = ref(false);
const cropper = ref<VueCropperMethods | null>();
const isUploadingPfp = ref(false);

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
    await $api.patchForm(`user/${session?.kv_data.user_id}`, {
      username: newUsername,
    });
    userStore.setProfile({ username: newUsername });
  } catch (error) {
    // Show error message
    console.error(error);
  }

  isSavingUsername.value = false;
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    if (!event.target?.result || !cropper.value) {
      // show error : Something went wrong
      return;
    }

    selectedImage.value = event.target.result;
    cropper.value.replace(selectedImage.value);
  });

  reader.readAsDataURL(target.files[0]);
  isCropperOpen.value = true;
}

function onCropAndUpload() {
  if (!cropper.value) return;

  cropper.value.getCroppedCanvas().toBlob(async (blob) => {
    isUploadingPfp.value = true;
    try {
      if (!blob) throw new Error("Something went wrong");

      const resp = await $api.patchForm<Partial<PatchProfileResponse>>(
        `user/${session?.kv_data.user_id}`,
        {
          picture: blob,
        }
      );
      userStore.setProfile({ picture: resp.data.picture });
    } catch (error) {
      console.error(error);
      // TODO: show error
    }

    // TODO : Change state in the store
    isUploadingPfp.value = false;
    isCropperOpen.value = false;
  });
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

.img-input {
  display: none;
}
</style>
