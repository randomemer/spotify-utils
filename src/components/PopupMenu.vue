<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    propIsOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: this.propIsOpen,
    };
  },
  watch: {
    propIsOpen(cur) {
      this.isOpen = cur;
    },
  },
});
</script>

<template>
  <div class="popup-menu" :class="{ 'menu-hidden': !isOpen }">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.popup-menu {
  width: max-content;
}

.menu-hidden {
  visibility: hidden;
  opacity: 0;
}
</style>
