<script lang="ts">
import { convertRemToPixels, getGenresFromTracks } from "@/utilities/functions";
import { defineComponent } from "vue";
import {
  ArcElement,
  CategoryScale,
  Chart,
  Legend,
  Title,
  Tooltip,
} from "chart.js";
import { Doughnut } from "vue-chartjs";

Chart.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default defineComponent({
  components: { Doughnut },
  data() {
    return {
      playlistID:
        "https://open.spotify.com/playlist/0LQN66XmARzQSM1XRCGWAU?si=b34b0ead91454095",
      isAnalysing: false,
      hasAnalysed: false,
      playlist: null as SpotifyApi.PlaylistObjectFull | null,
      avgPopularity: null as number | null,
      genres: null as [string, number][] | null,
    };
  },
  methods: {
    convertRemToPixels,
    extractID() {
      const url = new URL(this.playlistID);
      const paths = url.pathname.split("/");
      return paths[paths.length - 1];
    },
    async getPlaylistTracks(id: string) {},
    async analyse() {
      this.isAnalysing = true;
      try {
        const id = this.extractID();
        const playlist = await this.$spotify.getPlaylist(id);
        this.playlist = playlist;

        // get all tracks
        const tracks = playlist.tracks.items.map(
          (playlistTrack) => playlistTrack.track
        ) as SpotifyApi.TrackObjectFull[];
        if (playlist.tracks.next) {
          console.log("There's more tracks");
        }

        // get avg popularity
        this.avgPopularity =
          tracks.reduce((prev, track) => prev + track.popularity, 0) / 100;

        // get all genres
        this.genres = await getGenresFromTracks(tracks);
        console.log("genres :", this.genres);

        console.log("playlist :", playlist);
        this.hasAnalysed = true;
      } catch (error) {
        if (error instanceof TypeError) {
          console.error("Invalid URL!");
        } else {
          console.error(error);
        }
      }
      this.isAnalysing = false;
    },
  },
  computed: {
    chartData(): any {
      if (!this.genres) return;

      // prettier-ignore
      const materialColours = ["#f44336", "#00bcd4", "#9c27b0", "#03a9f4", "#4caf50", "#e91e63", "#3f51b5", "#ffc107", "#673ab7", "#009688", "#bbbbbb"];

      return {
        labels: [...this.genres.slice(0, 10).map((genre) => genre[0]), "other"],
        datasets: [
          {
            backgroundColor: materialColours,
            data: [
              ...this.genres.slice(0, 10).map((genre) => genre[1]),
              this.genres.slice(10).reduce((prev, cur) => prev + cur[1], 0),
            ],
          },
        ],
      };
    },
    chartOptions(): any {
      if (!this.genres) return;
      const genreSum = this.genres.reduce((prev, cur) => prev + cur[1], 0);
      return {
        radius: convertRemToPixels(10.8),
        // cutout: "60%",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            displayColors: false,
            bodyFont: {
              family: "Lexend Deca, sans-serif",
              size: convertRemToPixels(1.2),
            },
            callbacks: {
              label: function (context: any) {
                const dataPoint = context.dataset.data[context.dataIndex];
                const percent: string = ((dataPoint / genreSum) * 100).toFixed(
                  2
                );
                return `${context.label} : ${percent}%`;
              },
            },
          },
          legend: {
            display: false,
            position: "right",
            labels: {
              boxWidth: convertRemToPixels(1.4),
              color: "white",
              font: {
                family: "Lexend Deca, sans-serif",
                size: convertRemToPixels(1.4),
              },
            },
          },
        },
      };
    },
  },
});
</script>

<template>
  <main>
    <h1 class="heading-primary">Playlists</h1>

    <input
      class="playlist-link-input"
      placeholder="Enter a playlist link"
      v-model.trim="playlistID"
      @keydown.enter="analyse"
    />

    <div class="analysis" v-if="hasAnalysed">
      <div
        class="basic-info card"
        :style="{
          background: `url('${playlist?.images[0].url}')`,
        }"
      >
        <!-- <img class="playlist-image" :src="playlist?.images[0].url" /> -->
        <h3 class="name">{{ playlist?.name }}</h3>
        <p class="desc">{{ playlist?.description }}</p>
      </div>

      <div class="genres card">
        <h3>
          Has an assortment of
          <span class="genre-count">{{ genres?.length }}</span> genres!
        </h3>

        <Doughnut
          :chart-data="chartData"
          :chart-options="chartOptions"
          chart-id="genres-donut"
          :height="convertRemToPixels(32)"
        />
      </div>

      <div>
        <div class="avg-popularity card">
          <div class="top-row">
            <span class="avg-popularity-number">{{ avgPopularity }}%</span>
            <div class="avg-popularity-bar">
              <div
                class="avg-popularity-bar-track"
                :style="{ width: `${avgPopularity}%` }"
              ></div>
            </div>
          </div>
          <p>is the average popularity of your playlist's tracks</p>
          <div class="bottom-row"></div>
        </div>

        <div class="tracks card">
          <span class="number">{{ playlist?.tracks.total }}</span>
          <span class="text">Tracks</span>
        </div>
      </div>
      <div class="tracks-table"></div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.analysis {
  margin-top: 4.8rem;
  display: grid;
  // align-items: flex-start;
  gap: 4.8rem;
  grid-template-columns: auto 1fr 1fr;
}

.card {
  padding: 3rem;
}

.heading-primary {
  margin-bottom: 3.2rem;
}

.playlist-link-input {
  border-radius: 5px;
  font-size: 1.8rem;
  width: 100%;
}

.basic-info {
  // height: 25.6rem;
  background-size: contain;
  align-self: flex-start;

  img {
    max-width: 100%;
    min-width: 100%;
  }

  .name {
    font-size: 3rem;
    font-weight: 600;
  }

  .desc {
    font-size: 1.8rem;
  }
}

.tracks {
  display: flex;
  align-items: center;
  gap: 3rem;
  grid-column: auto !important;

  .number {
    font-size: 4.8rem;
    font-weight: 700;
    color: general.$primary-font-color;
  }

  .text {
    font-size: 3rem;
  }
}

.genres {
  h3 {
    font-size: 1.8rem;
    font-weight: 500;
  }

  .genre-count {
    color: general.$primary-font-color;
    font-size: 3rem;
  }
}

.avg-popularity {
  .top-row {
    display: flex;
    gap: 1.8rem;
    align-items: center;
  }

  #{&}-number {
    font-size: 3rem;
    color: general.$primary-font-color;
  }

  #{&}-bar {
    background-color: black;
    height: 2rem;
    width: 100%;
    border-radius: 100rem;
  }

  #{&}-bar-track {
    // @debug #{&};
    background-color: general.$primary-color;
    border-radius: 100rem;
    height: 100%;
  }

  p {
    margin-top: 2.4rem;
    line-height: 1.5;
    font-size: 1.8rem;
  }
}
</style>
