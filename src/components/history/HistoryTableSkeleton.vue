<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { chevronBack, chevronForward } from "ionicons/icons";
import _ from "lodash";

const randomLength = (start: number, end: number) =>
  `${_.random(start, end, true)}rem`;

const randomCount = (start: number, end: number) => _.random(start, end);
</script>

<template>
  <table class="history-table" cellspacing="0">
    <!-- Table Header -->
    <thead>
      <th class="track-number">#</th>
      <th>Track</th>
      <!-- <th>Genre</th> -->
      <th>Popularity</th>
      <th>Time</th>
    </thead>
    <!-- Table Rows -->
    <tbody>
      <tr v-for="(_, index) in Array(5)" :key="index">
        <td class="track-number">{{ index + 1 }}</td>
        <td class="track">
          <div class="track-image skeleton"></div>
          <div class="track-info">
            <span
              class="track-name skeleton"
              :style="{ height: '1.6rem', width: randomLength(10, 20) }"
            ></span>
            <ul class="track-artists">
              <li
                class="skeleton"
                v-for="(artist, i) in Array(randomCount(1, 3))"
                :key="i"
                :style="{ height: '1.2rem', width: randomLength(6, 10) }"
              ></li>
            </ul>
          </div>
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
        <td colspan="4">
          <div class="table-footer">
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
  background-color: rgba(255, 255, 255, 0.1);
  width: 100%;
  border-radius: 10px;
}

.history-table th {
  font-size: 1.6rem;
  text-transform: uppercase;
  color: #bbb;
  padding: 1.2rem 0;
  text-align: left;
  border-bottom: 1px solid grey;
}

.history-table tbody td {
  font-size: 1.6rem;
  margin: 1.2rem 0;
}

.button-group {
  display: flex;
  align-self: flex-end;
}

.history-table tfoot td {
  padding: 2.4rem;
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.history-table .track-number {
  padding: 0 2rem;
  text-align: center;
}

.track {
  display: flex;
  align-items: center;
  gap: 2rem;
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
  gap: 1rem;
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
