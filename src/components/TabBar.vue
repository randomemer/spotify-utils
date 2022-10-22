<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    tabs: { type: Array<{ label: string; value: any }>, required: true },
  },
  data() {
    return {
      activeTabValue: this.tabs[0].value,
    };
  },
  methods: {
    onTabSelect(value: any) {
      this.activeTabValue = value;
      this.$emit("tab-change", value);
    },
  },
  emits: ["tab-change"],
});
</script>

<template>
  <div class="tabbar">
    <div
      class="tab"
      :class="{ 'tab-active': tab.value === activeTabValue }"
      v-for="(tab, i) in tabs"
      :key="tab.value"
      @click="onTabSelect(tab.value)"
    >
      <label :for="`tab-${$.uid}-${i}`">{{ tab.label }}</label>
      <input :id="`tab-${$.uid}-${i}`" type="radio" name="tabs" />
    </div>

    <span class="glider"></span>
  </div>
</template>

<style scoped>
@import "@/assets/general.css";

.tabbar {
  display: flex;
  gap: 1.8rem;
}

.tab {
  font-size: 1.6rem;
  cursor: pointer;
  border-radius: 100rem;
  padding: 0.6rem 1.2rem;
  color: white;

  transition: all 0.15s ease-in;
}

.tabbar input {
  display: none;
}

.tab-active {
  background-color: var(--primary-color);
}
</style>
