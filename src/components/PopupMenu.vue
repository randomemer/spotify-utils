<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { createPopper } from "@popperjs/core";
import type { OptionsGeneric, Modifier } from "@popperjs/core";

export default defineComponent({
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    referenceElSelector: {
      type: String,
      required: true,
    },
    popperOptions: {
      type: Object as PropType<
        Partial<OptionsGeneric<Partial<Modifier<any, any>>>>
      >,
    },
  },
  watch: {
    isOpen() {
      this.$forceUpdate();
    },
  },
  methods: {
    onDocumentClick(event: Event) {
      const target = event.target as HTMLElement;
      if (
        !this.$el.contains(target) &&
        !target.closest(this.referenceElSelector)
      ) {
        this.$emit("toggled", false);
      }
    },
  },
  mounted() {
    const referenceEl = document.querySelector(this.referenceElSelector);
    if (!referenceEl) {
      console.warn("reference element not found");
    } else {
      createPopper(referenceEl, this.$el, this.popperOptions);
    }

    document.addEventListener("click", this.onDocumentClick);
  },
  unmounted() {
    document.removeEventListener("click", this.onDocumentClick);
  },
  emits: ["toggled"],
});
</script>

<template>
  <div class="popup-menu" :class="{ 'menu-hidden': !isOpen }">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
@keyframes swingLft {
  0% {
    opacity: 0;
    // transform: rotateY(90deg);
  }
  100% {
    opacity: 1;
    // transform: rotateY(0);
  }
}

.popup-menu {
  width: max-content;
  position: absolute;

  transition: all 0.15s ease-in;

  // &:not(.menu-hidden) {
  //   animation: swingLft forwards;
  // }
}

.menu-hidden {
  visibility: hidden;
  opacity: 0;
}
</style>
