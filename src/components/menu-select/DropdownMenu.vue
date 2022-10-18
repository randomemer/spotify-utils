<script lang="ts">
import { defineComponent } from "vue";
import { IonIcon } from "@ionic/vue";
import { calendarClear, chevronDown } from "ionicons/icons";

export default defineComponent({
  components: { IonIcon },
  props: {
    name: { type: String, required: true },
    defaultValue: String,
    options: { type: Array<{ label: string; value: any }>, required: true },
  },
  computed: {
    selectContainer() {
      return this.$refs.selectContainer as HTMLElement;
    },
    hiddenSelect() {
      return this.$refs.hiddenSelect as HTMLSelectElement;
    },
    selectStyled() {
      return this.$refs.selectStyled as HTMLDivElement;
    },
    selectOptions() {
      return this.$refs.selectOptions as HTMLUListElement;
    },
  },
  setup() {
    return { calendarClear, chevronDown };
  },
  methods: {
    setValue(value: any, shouldEmit: boolean = true) {
      const option = this.options.find((option) => option.value === value);
      this.selectStyled.textContent = option?.label as string | null;
      this.hiddenSelect.value = option?.value;
      if (shouldEmit) {
        this.$emit("value-change", this.hiddenSelect.value);
      }
    },
    customSelectPlugin() {
      this.hiddenSelect
        .querySelectorAll("option")
        .forEach((option: HTMLOptionElement) => {
          const listItem = document.createElement("li");
          listItem.setAttribute("value", option.value);
          listItem.innerHTML = option.innerText;
          listItem.addEventListener("click", () => {
            this.setValue(option.value);
          });
          this.selectOptions.appendChild(listItem);
        });
    },
    onCustomSelectClick() {
      this.selectOptions.classList.toggle("hidden");
      // this.selectStyled.classList.toggle("active");
    },
    onOptionSelected() {
      console.log();
    },
  },
  emits: ["value-change"],
  created() {
    document.addEventListener("click", (event: MouseEvent) => {
      if (!this.selectContainer.contains(event.target as Node | null)) {
        this.selectOptions.classList.add("hidden");
      }
    });
  },
  mounted() {
    if (this.defaultValue) {
      this.setValue(this.defaultValue, false);
    }

    this.customSelectPlugin();
  },
});
</script>

<template>
  <div
    class="select-container"
    @click="onCustomSelectClick"
    ref="selectContainer"
  >
    <label :for="($.vnode.key as string)">
      <ion-icon class="icon" :icon="calendarClear" />
    </label>

    <select
      class="select-hidden"
      ref="hiddenSelect"
      :name="name"
      :id="($.vnode.key as string)"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <div class="select-styled" ref="selectStyled">Select Period</div>

    <ul class="select-options hidden" ref="selectOptions"></ul>

    <ion-icon :icon="chevronDown" class="icon" />
  </div>
</template>

<style>
.icon {
  font-size: 1.6rem;
}

.select-container {
  display: inline-flex;
  position: relative;
  align-items: center;
  padding: 0.8rem;
  gap: 0.5rem;

  --select-background: rgba(255, 255, 255, 0.1);
  background-color: var(--select-background);
  border-radius: 5px;
  cursor: pointer;
}

.select-container,
.select-container * {
  transition: all 0.15s ease-in;
}

.select-hidden {
  display: none;
  visibility: hidden;
  padding-right: 10px;
}

.select-styled {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.select-container:hover,
.select-container:active,
.select-container.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.select-options {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  z-index: 999;
  margin: 0;
  padding: 0;
  list-style: none;
  border-radius: 5px;
  background-color: #555;
}

.hidden {
  opacity: 0;
  visibility: hidden;
}

.select-options li {
  margin: 0;
  padding: 12px 0;
  text-indent: 15px;
  transition: all 0.3s ease-in;
}

.select-options li:hover,
.select-options li.selected {
  color: white;
  background-color: #1db954;
}

.select-options li[rel="hide"] {
  display: none;
}
</style>
