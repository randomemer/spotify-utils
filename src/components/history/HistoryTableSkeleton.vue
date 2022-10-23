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

<style scoped>
.history-table {
  display: grid;
  align-items: center;
  justify-content: stretch;
  grid-template-columns: auto 1fr auto auto;
  background-color: rgba(255, 255, 255, 0.1);
  min-width: 100%;
  border-radius: 10px;
  grid-row-gap: 1.6rem;
  /* overflow-y: hidden; */
  --table-padding: 3rem;
}

.history-table thead,
.history-table tbody,
.history-table tfoot,
.history-table tr {
  display: contents;
}

.history-table th {
  text-transform: uppercase;
  color: var(--primary-font-color);
  padding: 1.6rem 0;
  text-align: left;
  font-weight: 500;
  letter-spacing: 1px;
  border-bottom: 1px solid grey;
}

.history-table td,
.history-table th {
  font-size: 1.6rem;
  padding-left: 1.1rem;
  padding-right: 1.1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Left padding for table */
.history-table td:first-child,
.history-table th:first-child {
  padding-left: var(--table-padding);
}

/* Right padding for table */
.history-table td:last-child,
.history-table th:last-child {
  padding-right: var(--table-padding);
}

.button-group {
  display: flex;
  align-self: flex-end;
}

.history-table .track-number {
  padding-left: 2.4rem;
  padding-right: 2.4rem;
  text-align: center;
}

.table-footer {
  padding: 1.6rem 0;
  border-top: 1px solid grey;
  grid-column: span 4;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.history-table .track-number {
  padding-left: 2.4rem;
  padding-right: 2.4rem;
  text-align: center;
}

.track-popularity {
  height: 1.4rem;
  width: 10rem;
}

.track-played-at {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-nav-button {
  background: none;
  display: flex;
  align-items: center;
  /* gap: 5px; */
  padding: 0.8rem 1.6rem;
  border-radius: 5px;
  color: #1db954;
  font-size: 1.8rem;
}
</style>
