<template>
  <v-dialog max-width="600px">
    <v-card>
      <v-card-title>Save Playlist</v-card-title>

      <v-card-text>
        <form>
          <div class="form-left">
            <label class="playlist-img-label" for="playlist-img">
              <div class="empty-img" v-if="!img">
                <v-icon icon="mdi-image-plus" />
              </div>
              <img class="thumbnail" v-else :src="img" />
              <input
                id="playlist-img"
                type="file"
                accept="image/*"
                @input="onImageInput($event)"
              />
            </label>

            <v-checkbox
              density="compact"
              v-model="isPublic"
              true-icon="mdi-eye"
              false-icon="mdi-eye-off"
              :label="isPublic ? `Public` : `Private`"
            />
          </div>

          <div class="text-fields">
            <v-text-field color="primary" density="compact" label="Name" />
            <v-textarea color="primary" density="compact" label="Description" />
          </div>
        </form>
      </v-card-text>

      <v-card-actions class="justify-end pa-4">
        <v-btn color="primary" variant="flat">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const file = ref<File | null>();
const isPublic = ref(true);

const img = computed(() => {
  if (!file.value) return;
  return URL.createObjectURL(file.value);
});

function onImageInput(event: Event) {
  const input = event.target as HTMLInputElement;
  file.value = input.files?.item(0);
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
