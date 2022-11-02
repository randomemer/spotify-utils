<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { chevronBack, chevronForward } from "ionicons/icons";
import TrackItemSkeleton from "@/components/track/TrackItemSkeleton.vue";
</script>

<template>
  <table class="history-table">
    <!-- Table Header -->
    <thead>
      <tr>
        <th class="track-number">#</th>
        <th>Track</th>
        <th>Popularity</th>
        <th>Time</th>
      </tr>
    </thead>
    <!-- Table Rows -->
    <tbody>
      <tr v-for="(_, index) in Array(5)" :key="index">
        <td class="track-number">{{ index + 1 }}</td>
        <td>
          <TrackItemSkeleton />
        </td>
        <td>
          <div class="track-popularity skeleton"></div>
        </td>
        <td>
          <div class="track-played-at">
            <span class="skeleton" style="height: 1.2rem; width: 8rem"></span>
            <span class="skeleton" style="height: 1.2rem; width: 10rem"></span>
          </div>
        </td>
      </tr>
    </tbody>
    <!-- Table Footer -->
    <tfoot>
      <tr>
        <td class="table-footer">
          <div>
            <div class="button-group">
              <button class="data-nav-button">
                <ion-icon :icon="chevronBack"></ion-icon>
                <span>Previous</span>
              </button>
              <button class="data-nav-button">
                <span>Next</span>
                <ion-icon :icon="chevronForward"></ion-icon>
              </button>
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<style scoped lang="scss">
@use "./history-table.scss";

.button-group {
  display: flex;
  align-self: flex-end;
}

.table-footer {
  padding: 1.6rem 0;
  border-top: 1px solid grey;
  grid-column: span 4;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.track-popularity {
  height: 1.4rem;
  width: 10rem;
}

.data-nav-button {
  background: none;
  display: flex;
  align-items: center;
  /* gap: 5px; */
  padding: 0.8rem 1.6rem;
  border-radius: 5px;
  color: general.$primary-font-color;
  font-size: 1.8rem;
}
</style>
