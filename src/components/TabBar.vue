<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    tabs: { type: Array<{ label: string; value: any }>, required: true },
  },
  emits: ["tab-change"],
});
</script>

<template>
  <div class="tabbar">
    <div
      class="tab"
      v-for="tab in tabs"
      :key="tab.value"
      @click="$emit('tab-change', tab.value)"
    >
      {{ tab.label }}
    </div>
  </div>
</template>

<style scoped>
.tabbar {
  display: flex;
  gap: 1.8rem;
}

.tab {
  font-size: 1.8rem;
  cursor: pointer;
}
</style>
