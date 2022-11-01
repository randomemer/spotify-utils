<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { IonIcon } from "@ionic/vue";
import { chevronBack, chevronForward } from "ionicons/icons";
import TrackItem from "@/components/track/TrackItem.vue";

export default defineComponent({
  components: { IonIcon, TrackItem },
  props: {
    tracks: {
      required: true,

      type: Object as PropType<SpotifyApi.TrackObjectFull[]>,
    },
  },
  setup() {
    return { chevronBack, chevronForward };
  },
});
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
      <tr v-for="(track, index) in tracks" :key="index">
        <td class="track-number">
          {{ index + 1 }}
        </td>
        <td class="track">
          <TrackItem :track="track" />
        </td>
        <td>
          <div class="track-popularity">
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ width: `${Number(track.popularity)}%` }"
              ></div>
            </div>
            <span>{{ track.popularity }}%</span>
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
              </button>
              <!-- <span class="page-index">{{ curPage }}</span> -->
              <button class="data-nav-button">
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
@import "./table-styles.scss";

.track-popularity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-track {
  width: 10rem;
  height: 1.4rem;
  background-color: black;
  border-radius: 10rem;
}

.bar-fill {
  height: 1.4rem;
  border-radius: 10rem;
  background-color: var(--primary-color);

  transition: width 0.3s;
  width: 0;
}
</style>
