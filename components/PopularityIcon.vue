<template>
  <div class="popularity-wrapper" v-tooltip="`Popularity`">
    <div class="star-icon">
      <svg
        class="ionicon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <defs>
          <!-- Define a clipping path that follows the path of the icon -->
          <path
            id="icon-path"
            d="M480 208H308L256 48l-52 160H32l140 96-54 160 138-100 138 100-54-160z"
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
          />
        </defs>
        <!-- Use the clipping path to clip the fill -->
        <clipPath id="icon-clip">
          <use xlink:href="#icon-path" />
        </clipPath>
        <!-- Draw the path using a stroke (no fill) -->
        <path
          d="M480 208H308L256 48l-52 160H32l140 96-54 160 138-100 138 100-54-160z"
          fill="none"
          stroke="currentColor"
          stroke-linejoin="round"
          stroke-width="32"
        />
        <rect
          x="0"
          y="0"
          :width="`${props.value.toFixed(0)}%`"
          height="100%"
          fill="currentColor"
          clip-path="url(#icon-clip)"
        />
      </svg>
    </div>
    <p class="percent-text">{{ props.value.toFixed(0) }} %</p>
  </div>
</template>

<script setup lang="ts">
interface PopularityIconProps {
  value: number;
}

const props = defineProps<PopularityIconProps>();
</script>

<style scoped lang="scss">
.popularity-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.5625rem;
}

.ionicon {
  display: block;
  width: 1em;
  height: 1em;
  color: var(--yellow-500);
  position: relative;
}

.percent-text {
  font-size: 1rem;
}
</style>
