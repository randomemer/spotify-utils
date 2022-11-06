<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    pageSize: {
      type: Number,
      default: 50,
    },
  },
});
</script>

<template>
  <table>
    <thead>
      <slot name="thead"></slot>
    </thead>
    <tbody>
      <slot name="tbody"></slot>
    </tbody>
    <tfoot>
      <slot name="tfoot"></slot>
    </tfoot>
  </table>
</template>

<style lang="scss">
@import "./table-styles.scss";
</style>
