<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import ChipElement from "./ChipElement.vue";

export default defineComponent({
  components: {
    ChipElement,
  },
  props: {
    callback: { type: Function, required: true },
    defaultChipValue: {},
    chipsData: {
      type: Object as PropType<{ [key: string]: any }>,
      required: true,
    },
  },
  methods: {
    anyChipSelected(value: any) {
      const chips = this.$refs.chips as InstanceType<typeof ChipElement>[];

      for (const chip of chips) {
        chip.isActive = chip.value === value;
      }

      this.callback(value);
    },
  },
  mounted() {
    if (this.defaultChipValue) {
      const chips = this.$refs.chips as InstanceType<typeof ChipElement>[];
      const defaultChip = chips.find(
        (chip) => chip.value === this.defaultChipValue
      );
      if (defaultChip) defaultChip.isActive = true;
    }
  },
});
</script>

<template>
  <div class="chips-container">
    <ChipElement
      v-for="(value, key) in chipsData"
      :key="value"
      :content="key"
      :value="value"
      ref="chips"
      v-on:selected="anyChipSelected"
    />
  </div>
</template>

<style scoped>
.chips-container {
  display: flex;
  gap: 1.2rem;
}
</style>
