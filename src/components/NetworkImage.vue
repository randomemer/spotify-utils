<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    src: { required: true, type: String },
    alt: { required: true, type: String },
  },
  computed: {
    image() {
      return this.$refs.image as HTMLImageElement;
    },
  },
  mounted() {
    if (!this.image.complete) {
      this.image.addEventListener("load", () =>
        this.image.classList.remove("img-loading")
      );
    }
  },
});
</script>

<template>
  <img :src="src" :alt="alt" ref="image" class="img-loading" />
</template>

<style scoped>
.img-loading {
  background-color: aqua;
}
</style>
