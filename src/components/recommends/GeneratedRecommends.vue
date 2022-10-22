<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  beforeRouteEnter(to, from) {
    console.log(to.params);
  },
});
</script>

<template>
  <main>
    <h2 class="heading-secondary">Generated</h2>
  </main>
</template>

<style scoped></style>
