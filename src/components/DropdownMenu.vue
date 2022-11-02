<script lang="ts">
import { defineComponent } from "vue";
import { IonIcon } from "@ionic/vue";
import { calendarClear, chevronDown } from "ionicons/icons";

export default defineComponent({
  components: { IonIcon },
  data() {
    return {
      isMenuOpen: false,
    };
  },
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
    onDocumentClick(event: MouseEvent) {
      if (!this.selectContainer.contains(event.target as Node | null)) {
        this.selectOptions.classList.add("hidden");
      }
    },
  },
  emits: ["value-change"],
  created() {
    document.addEventListener("click", this.onDocumentClick);
  },
  mounted() {
    if (this.defaultValue) {
      this.setValue(this.defaultValue, false);
    }

    this.customSelectPlugin();
  },
  unmounted() {
    document.removeEventListener("click", this.onDocumentClick);
  },
});
</script>

<template>
  <div
    class="select-container"
    @click="isMenuOpen = !isMenuOpen"
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

    <ul
      class="select-options"
      :class="{ hidden: !isMenuOpen }"
      ref="selectOptions"
    ></ul>

    <ion-icon
      :icon="chevronDown"
      class="dropdown-icon"
      :style="{ transform: `rotate(${isMenuOpen ? 180 : 0}deg)` }"
    />
  </div>
</template>

<style scoped lang="scss">
.select-container {
  display: inline-flex;
  position: relative;
  align-items: center;
  padding: 0.8rem;
  gap: 0.5rem;

  $select-background: rgba(255, 255, 255, 0.1);
  background-color: $select-background;
  border-radius: 5px;
  cursor: pointer;

  &:hover,
  &:active,
  &.active {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &,
  & * {
    transition: all 0.15s ease-in;
  }

  ion-icon {
    font-size: 1.6rem;
    transition: all 0.3s ease-in;
  }
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
  transform-origin: 50% 0;
  overflow: hidden;

  li {
    margin: 0;
    padding: 12px 0;
    text-indent: 15px;
    transition: all 0.3s ease-in;

    &:hover,
    &.selected {
      color: white;
      background-color: general.$primary-color;
    }

    &[rel="hide"] {
      display: none;
    }
  }
}

.hidden {
  opacity: 0;
  visibility: hidden;
  transform: scaleY(0);
}
</style>
