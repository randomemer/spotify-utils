<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  created() {
    this.$cookies.set("state", "guest");
    console.log(location.origin);
    console.log(this.$cookies.keys());
  },
});
</script>

<template>
  <main></main>
</template>
