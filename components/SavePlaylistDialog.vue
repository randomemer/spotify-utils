<template>
  <v-dialog max-width="37.5rem">
    <v-card>
      <v-card-title>Save Playlist</v-card-title>

      <v-card-text>
        <form @submit.prevent="onSave()">
          <div class="form-left">
            <label class="playlist-img-label" for="playlist-img">
              <div class="empty-img" v-if="!img">
                <v-icon icon="mdi-image-plus" />
              </div>
              <img class="thumbnail" v-else :src="img" />
              <input
                id="playlist-img"
                type="file"
                accept="image/jpeg"
                @input="onImageInput($event)"
              />
            </label>

            <v-checkbox
              class="align-self-center"
              density="compact"
              v-model="isPublic"
              true-icon="mdi-eye"
              false-icon="mdi-eye-off"
              :label="isPublic ? `Public` : `Private`"
            />
          </div>

          <div class="text-fields">
            <v-text-field
              v-model="name"
              color="primary"
              density="compact"
              label="Name"
            />
            <v-textarea
              v-model="desc"
              color="primary"
              density="compact"
              label="Description"
            />
          </div>
        </form>
      </v-card-text>

      <v-card-actions class="justify-end pa-4">
        <v-btn
          :loading="saving"
          color="primary"
          variant="flat"
          @click="onSave()"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import useUserStore from "~/store/user.store";

interface SavePlaylistDialogProps {
  defaultDesc?: string | null;
  tracks: (
    | SpotifyApi.TrackObjectFull
    | SpotifyApi.TrackObjectSimplified
    | SpotifyApi.TrackLinkObject
  )[];
}

const props = defineProps<SavePlaylistDialogProps>();

const { $spotify } = useNuxtApp();
const userStore = useUserStore();

const file = ref<File | null>();
const isPublic = ref(true);
const name = ref("");
const desc = ref(props.defaultDesc ?? "");

const saving = ref(false);

const img = computed(() => {
  if (!file.value) return;
  return URL.createObjectURL(file.value);
});

function onImageInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const temp = input.files?.item(0);

  if (!temp) return;
  if (temp.size > 256_000) {
    // @TODO : Show an error snackbar
    return;
  }

  file.value = temp;
}

async function onSave() {
  saving.value = true;
  try {
    // 1. Create playlist
    const { data: playlist } =
      await $spotify.post<SpotifyApi.CreatePlaylistResponse>(
        `/users/${userStore.spotifyProfile!.id}/playlists`,
        {
          name: name.value,
          public: isPublic.value,
          description: desc.value,
        }
      );
    console.log(playlist);

    // 2. Add cover image (if provided)
    if (file.value) {
      const imgData = await imgBase64(file.value);
      await $spotify.put(`/playlists/${playlist.id}/images`, imgData);
    }

    // 3. Add tracks
    const uris = props.tracks.map((track) => track.uri);
    await $spotify.post(`/playlists/${playlist.id}/tracks`, uris);
  } catch (error) {
    console.error(error);
  }
  saving.value = false;
}

async function imgBase64(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target!.result as string);
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
}
</script>

<style scoped lang="scss">
form {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.form-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

#playlist-img {
  display: none;
}

.playlist-img-label {
  position: relative;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  overflow: clip;
  object-fit: cover;

  height: 7.5rem;
  width: 7.5rem;

  background-color: rgba(255, 255, 255, 0.05);
}

.empty-img,
.thumbnail {
  height: 100%;
  width: 100%;
}

.empty-img {
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(.v-icon) {
    font-size: 2rem;
  }
}

.text-fields {
  flex: 1;
}

.thumbnail {
  max-height: 100%;
  max-width: 100%;
}
</style>

<style>
.v-selection-control {
  gap: 0.5rem;
}
</style>
