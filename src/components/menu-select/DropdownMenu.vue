<script lang="ts">
import { defineComponent } from "vue";
import { IonIcon } from "@ionic/vue";
import { calendarClear } from "ionicons/icons";

export default defineComponent({
  components: { IonIcon },
  props: {
    name: { type: String, required: true },
    defaultValue: String,
    options: { type: Array<{ label: string; value: any }>, required: true },
  },
  setup() {
    return { calendarClear };
  },
  methods: {
    onValueChange() {
      const select = this.$refs.select as HTMLSelectElement;
      this.$emit("value-change", select.value);
    },
  },
  emits: ["value-change"],
  mounted() {
    if (this.defaultValue) {
      (this.$refs.select as HTMLSelectElement).value = this.defaultValue;
    }
  },
});
</script>

<template>
  <div class="select-container">
    <label :for="($.vnode.key as string)">
      <ion-icon class="icon" :icon="calendarClear" />
    </label>

    <select
      :name="name"
      v-on:change="onValueChange"
      :id="($.vnode.key as string)"
      class="select"
      ref="select"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        class="option-value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<style>
.select-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.icon {
  font-size: 1.8rem;
}

.select {
  transition: all 0.3s;
  border-radius: 5px;
  padding: 0.8rem;

  /* Fixing Input Styles */
  font: inherit;
  color: white;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.select:hover,
.select:active {
  background-color: rgba(255, 255, 255, 0.1);
}

.option-value {
  text-transform: capitalize;
  font-size: 1.4rem;
  /* background-color: rgba(255, 255, 255, 0.5); */
  padding: 1rem;
}
</style>
