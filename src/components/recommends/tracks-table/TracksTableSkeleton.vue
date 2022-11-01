<script setup lang="ts">
import TrackItemSkeleton from "@/components/track/TrackItemSkeleton.vue";
</script>

<template>
  <table class="tracks-table">
    <thead>
      <tr>
        <th class="track-number">#</th>
        <th>Track</th>
        <th>Popularity</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(_, index) in Array(5)" :key="index">
        <td class="track-number">{{ index + 1 }}</td>
        <td>
          <TrackItemSkeleton />
        </td>
        <td>
          <div class="track-popularity skeleton"></div>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <td></td>
    </tfoot>
  </table>
</template>

<style scoped lang="scss">
@import "./table-styles.scss";

.history-table .track-number {
  padding-left: 2.4rem;
  padding-right: 2.4rem;
  text-align: center;
}

.track-image {
  --size: 5rem;
  height: var(--size);
  width: var(--size);
  border-radius: var(--size);
  object-fit: cover;
}

.track-info {
  display: flex;
  flex-direction: column;
  text-align: start;
  gap: 10px;
}

.track-artists {
  display: flex;
  list-style: none;
  gap: 8px;
  color: #bbb;
  font-size: 1.4rem;
}

.track-popularity {
  height: 1.4rem;
  width: 10rem;
}
</style>
