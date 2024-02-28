<template>
  <v-snackbar
    :location="$props.location"
    :variant="variant"
    :timeout="timeout"
    :color="color"
    v-model="active"
    class="vts"
    :class="classes"
    @click="dismiss"
    role="alert"
  >
    <v-icon v-if="!!icon" class="vts__icon" :icon="icon" :color="iconColor" />

    <div
      class="vts__message"
      :class="{ 'vts__message--padded': showClose && !closeText }"
    >
      <div v-html="message"></div>
      <slot></slot>
    </div>

    <v-btn
      :icon="!closeText"
      :text="!!closeText"
      class="vts__close"
      :class="{ 'vts__close--icon': !closeText }"
      :color="closeColor"
      v-if="showClose"
      @click="close"
    >
      <v-icon v-if="!closeText">{{ closeIcon }}</v-icon>
      <span v-if="!!closeText">{{ closeText }}</span>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    location: {
      type: String,
      default: "bottom right",
    },
    color: {
      type: String,
      default: "info",
    },
    icon: {
      type: String,
      default: "",
    },
    iconColor: {
      type: String,
      default: "",
    },
    classes: {
      type: [String, Object, Array],
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    timeout: {
      type: Number,
      default: 3000,
    },
    dismissable: {
      type: Boolean,
      default: true,
    },
    multiLine: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    showClose: {
      type: Boolean,
      default: false,
    },
    closeText: {
      type: String,
      default: "",
    },
    closeIcon: {
      type: String,
      default: "close",
    },
    closeColor: {
      type: String,
      default: "",
    },
    variant: {
      type: String,
      default: "tonal",
    },
  },

  data: () => ({
    active: false,
  }),

  mounted() {
    console.log(this.$props);
    this.$nextTick(() => this.show());
  },

  watch: {
    active: function (isActive, wasActive) {
      this.$emit("statusChange", isActive, wasActive);
    },
  },

  methods: {
    show() {
      this.active = true;
    },

    close() {
      this.active = false;
    },

    dismiss() {
      if (this.dismissable) {
        this.close();
      }
    },
  },
};
</script>

<style lang="scss">
.vts {
  max-width: none !important;
  width: auto !important;
}

.vts .v-snackbar__content {
  display: flex;
  justify-content: flex-start;
}

.vts__icon {
  margin-right: 0.5rem;
}

/*
.vts__message {
  margin-right: auto;
}

.vts__close {
  margin: 0 -8px 0 24px !important;
  justify-self: flex-end;
}

.vts.v-snack--vertical .vts__icon {
  margin: 0 0 12px !important;
}

.vts.v-snack--vertical .v-snack__content {
  padding-bottom: 16px !important;
}

.vts.v-snack--vertical .vts__message--padded {
  padding: 12px 0 0;
}

.vts.v-snack--vertical .vts__icon + .vts__message {
  padding-top: 0;
}

.vts.v-snack--vertical .vts__close {
  margin: 12px 0 -8px !important;
}

.vts.v-snack--vertical .vts__close--icon {
  margin: 0 !important;
  position: absolute;
  right: 4px;
  top: 4px;
  transform: scale(0.75);
  padding: 4px !important;
} */
</style>
