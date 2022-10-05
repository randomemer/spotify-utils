<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    content: {
      type: [String, Number],
      required: true,
    },
    value: {
      required: true,
    },
  },
  data() {
    return {
      isActive: false,
    };
  },
  emits: ["selected"],
});
</script>

<template>
  <div
    class="chip"
    :class="{ 'chip--active': isActive }"
    v-on:click="$emit('selected', value)"
  >
    <span class="chip-content"> {{ content }}</span>
  </div>
</template>

<style scoped>
.chip {
  border-radius: 10rem;
  /* creates an effect where border occupies content space */
  box-shadow: inset 0px 0px 0px 1px white;
  padding: 0.8rem 1.6rem;
}

.chip,
.chip * {
  transition: all 0.3s;
}

.chip:hover {
  cursor: pointer;
}

.chip:hover:not(.chip--active) {
  background-color: rgba(29, 185, 84, 0.15);
}

.chip--active {
  background-color: rgba(29, 185, 84, 0.4);
  box-shadow: none;
}

.chip-content {
  font-size: 1.2rem;
}
</style>
