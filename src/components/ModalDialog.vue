<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { closeOutline } from "ionicons/icons";
import { ref } from "vue";

const isModalOpen = ref(false);
defineExpose({ isModalOpen });
</script>

<template>
  <div class="modal" :class="{ 'show-modal': isModalOpen }">
    <div class="modal-content">
      <span class="close-button" @click="isModalOpen = false">
        <ion-icon :icon="closeOutline" />
      </span>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transform: scale(1.1);
  transition: all 0.3;
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #302c2c;
  padding: 2.4rem;
  border-radius: 0.5rem;
}

.show-modal {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;

  font-size: 2.4rem;
  padding: 0.5rem;
  border-radius: 3rem;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  margin-left: 10px;
}

.close-button:hover {
  background-color: rgba(169, 169, 169, 0.5);
}
</style>
