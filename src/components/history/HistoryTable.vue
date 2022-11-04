<script lang="ts">
import { spotify } from "@/utilities/spotify-api";
import { IonIcon } from "@ionic/vue";
import { chevronBack, chevronForward } from "ionicons/icons";
import { defineComponent, type PropType } from "vue";
import "sticksy";

export async function checkNextPage(currentPage: RecentlyPlayedTracks) {
  const next = await spotify.getMyRecentlyPlayedTracks({
    limit: 20,
    before: Number(currentPage.cursors.before),
  });
  return Boolean(next?.items.length > 0);
}

export default defineComponent({
  components: { IonIcon },
  props: {
    propsHistory: {
      required: true,
      type: Object as PropType<RecentlyPlayedTracks>,
    },
    propHasNext: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      isLoading: false,
      curPage: 1,
      history: this.propsHistory,
      hasNext: this.propHasNext,
    };
  },
  setup() {
    return { chevronBack, chevronForward };
  },
  methods: {
    dateFormat: (timestamp: number) => `${new Date(timestamp).toDateString()}`,
    timeFormat: (timestamp: number) =>
      `${new Date(timestamp).toLocaleTimeString()}`,
    previous() {
      if (this.isLoading) return;
      this.curPage = Math.max(1, this.curPage - 1);
    },
    next() {
      if (this.isLoading) return;
      this.curPage++;
    },
  },
  watch: {
    async curPage(cur, prev) {
      this.isLoading = true;

      if (cur - prev === 1) {
        this.history = (await spotify.getMyRecentlyPlayedTracks({
          limit: 20,
          before: Number(this.history.cursors.before),
        })) as RecentlyPlayedTracks;
      } else if (cur - prev === -1) {
        this.history = (await spotify.getMyRecentlyPlayedTracks({
          limit: 20,
          after: Number(this.history.cursors.after),
        })) as RecentlyPlayedTracks;
      }

      this.hasNext = await checkNextPage(this.history);
      this.isLoading = false;
    },
  },
  mounted() {
    const stick = new Sticksy(".history-table");
  },
});
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
      <tr v-for="({ track, played_at }, index) in history.items" :key="index">
        <td class="track-number">
          {{ index + 1 }}
        </td>
        <td>
          <div class="track">
            <a class="link" :href="track.external_urls.spotify" target="_blank">
              <img class="track-image" :src="track.album.images[0].url" />
            </a>
            <div class="track-info">
              <a class="track-name link" :href="track.external_urls.spotify">{{
                track.name
              }}</a>
              <ul class="track-artists">
                <li
                  class="track-artisit"
                  v-for="artist in track.artists"
                  :key="artist.id"
                >
                  <a
                    :href="artist.external_urls.spotify"
                    class="link"
                    target="_blank"
                  >
                    {{ artist.name }}
                  </a>
                </li>
              </ul>
            </div>
            <!-- <iframe
            style="border-radius: 12px"
            src="https://open.spotify.com/embed/track/4EyPadLFhtWojU7mkT5hqT?utm_source=generator&theme=0"
            width="100%"
            height="75"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe> -->
          </div>
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
        <td>
          <div class="track-played-at">
            <span>{{ timeFormat(Date.parse(played_at)) }}</span>
            <span>{{ dateFormat(Date.parse(played_at)) }}</span>
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
              <button
                class="data-nav-button"
                @click="previous"
                :disabled="curPage === 1 && !isLoading"
              >
                <ion-icon :icon="chevronBack"></ion-icon>
              </button>
              <span class="page-index">{{ curPage }}</span>
              <button
                class="data-nav-button"
                @click="next"
                :disabled="!hasNext && !isLoading"
              >
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

.history-table {
  .track {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .track-image {
    $size: 5rem;
    height: $size;
    width: $size;
    border-radius: $size;
    object-fit: cover;
  }

  .table-footer {
    padding: 1.6rem 0;
    border-top: 1px solid grey;
    grid-column: span 4;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.button-group {
  display: flex;
  align-items: stretch;
  gap: 1.8rem;
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
  color: #bbb;
  font-size: 1.4rem;

  li + li:before {
    content: ", ";
  }
}

.track-popularity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.data-nav-button {
  background: none;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  padding: 0.5rem;
  border-radius: 5px;
  color: general.$primary-font-color;
  font-size: 2.4rem;
  transition: background 0.3s ease-out;
  cursor: auto;

  &:disabled {
    color: #bbb;
  }

  &:not(:disabled):hover,
  &:not(:disabled):active {
    background-color: general.$splash-color;
    cursor: pointer;
  }
}

.page-index {
  font-size: 1.8rem;
  text-align: center;
  display: flex;
  align-items: center;
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
  background-color: general.$primary-color;

  transition: width 0.3s;
  width: 0;
}
</style>
