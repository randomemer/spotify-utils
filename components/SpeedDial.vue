<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <div v-bind="props" v-bind:="$attrs" class="speed-dial">
        <div class="fab-wrapper">
          <slot name="fab"></slot>
        </div>

        <v-fab-transition>
          <div v-show="isHovering" class="actions-wrapper">
            <slot name="actions"></slot>
          </div>
        </v-fab-transition>
      </div>
    </template>
  </v-hover>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.speed-dial {
  display: flex;
  flex-direction: column-reverse;
  gap: 1rem;
}

.actions-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
