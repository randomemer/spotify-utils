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
  border-color: white;
  border-style: solid;
  border-width: 1px;
  padding: 0.8rem 1.6rem;
}

.chip:hover {
  background-color: rgba(29, 185, 84, 0.15);
  cursor: pointer;
}

.chip--active {
  background-color: rgba(29, 185, 84, 0.4);
}

.chip-content {
  font-size: 1.2rem;
}
</style>
