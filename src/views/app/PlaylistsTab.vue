<script lang="ts">
import {
  convertRemToPixels,
  getArtistsFromTracks,
  getGenresFromTracks,
} from "@/utilities/functions";
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
import TracksTable from "@/components/recommends/tracks-table/TracksTable.vue";
import ArtistItem from "@/components/ArtistItem.vue";

Chart.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default defineComponent({
  components: { Doughnut, TracksTable, ArtistItem },
  data() {
    return {
      chartSize: 225,
      playlistID:
        "https://open.spotify.com/playlist/0LQN66XmARzQSM1XRCGWAU?si=b34b0ead91454095",
      isAnalysing: false,
      hasAnalysed: false,
      // analysis data
      playlist: null as SpotifyApi.PlaylistObjectFull | null,
      avgPopularity: null as number | null,
      genres: null as [string, number][] | null,
      tracks: null as PlaylistItem[] | null,
      artists: null as SpotifyApi.ArtistObjectFull[] | null,
    };
  },
  methods: {
    convertRemToPixels,
    extractID() {
      const url = new URL(this.playlistID);
      const paths = url.pathname.split("/");
      return paths[paths.length - 1];
    },
    getArtistsFreq(
      tracks: SpotifyApi.TrackObjectFull[],
      artists: Map<string, SpotifyApi.ArtistObjectFull>
    ) {
      const freqs = new Map<string, number>();

      for (const track of tracks) {
        for (const artist of track.artists) {
          const freq = freqs.get(artist.id) || 0;
          freqs.set(artist.id, freq + 1);
        }
      }

      const sorted = [...artists.values()].sort(
        (a, b) => freqs.get(b.id)! - freqs.get(a.id)!
      );
      return sorted;
    },
    async getPlaylistTracks(playlist: SpotifyApi.SinglePlaylistResponse) {
      const tracks: PlaylistItem[] = playlist.tracks.items.map(
        (item) => item.track
      );

      let response = playlist.tracks;

      while (response.offset + response.limit < response.total) {
        response = await this.$spotify.getPlaylistTracks(playlist.id, {
          offset: response.offset + response.limit,
          limit: response.limit,
        });

        tracks.push(...response.items.map((item) => item.track));
      }

      return tracks;
    },
    async analyse() {
      this.isAnalysing = true;
      try {
        const id = this.extractID();
        const playlist = await this.$spotify.getPlaylist(id);
        this.playlist = playlist;

        // get all tracks
        const tracks = await this.getPlaylistTracks(playlist);
        this.tracks = tracks;

        // get all artists
        const artists = await getArtistsFromTracks(tracks);
        this.artists = this.getArtistsFreq(tracks, artists);

        // get avg popularity
        this.avgPopularity =
          tracks.reduce((prev, track) => prev + track.popularity, 0) /
          tracks.length;

        // get all genres
        this.genres = await getGenresFromTracks(tracks);

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
        cutout: "50%",
        // aspectRatio: 1,
        // maintainAspectRatio: false,
        responsive: false,
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
      <div class="first-col">
        <div
          class="basic-info card"
          :style="{
            background: `linear-gradient(rgba(115, 0, 153, 0.75), rgba(0, 0, 0, 0.75)), url('${playlist?.images[0].url}')`,
          }"
        >
          <h3 class="name">{{ playlist?.name }}</h3>
          <!-- <span class="track-count">
            <span class="number">{{ playlist?.tracks.total }}</span>
            tracks
          </span> -->
          <p class="desc">{{ playlist?.description }}</p>
        </div>

        <div class="avg-popularity card">
          <div class="top-row">
            <span class="avg-popularity-number"
              >{{ avgPopularity?.toFixed(2) }}%</span
            >
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
      </div>

      <div class="genres card">
        <h3>
          Has an assortment of
          <span class="genre-count">{{ genres?.length }}</span> genres!
        </h3>

        <Doughnut
          chart-id="genres-donut"
          :chart-data="chartData"
          :chart-options="chartOptions"
          :width="chartSize"
          :height="chartSize"
        />
      </div>

      <div class="artists card">
        <h3>
          Featuring
          <span class="artist-count">{{ artists?.length }}</span> different
          artists
        </h3>

        <div class="top-artists">
          <ArtistItem
            :artist="artist"
            :key="artists?.id || i"
            v-for="(artist, i) in artists?.slice(0, 3)"
          />
        </div>

        <span class="more" v-if="artists && artists.length > 3">
          and more ...
        </span>
      </div>
    </div>

    <TracksTable :tracks="tracks" v-if="tracks" />
  </main>
</template>

<style scoped lang="scss">
#genres-donut {
  background-color: general.$danger-color;

  // width: 100% !important;
  // height: 100% !important;
}

.analysis {
  margin: 4.8rem 0;
  display: grid;
  // align-items: flex-start;
  gap: 4.8rem;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: stretch;
}

.first-col {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: inherit;
}

.card {
  padding: 2.4rem;
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
  background-size: cover !important;
  flex-grow: 1;

  .name {
    font-size: 3rem;
    margin-bottom: 1.8rem;
    font-weight: 600;
  }

  .track-count {
    font-size: 1.6rem;
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
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    font-size: 1.8rem;
    margin-bottom: 1.8rem;
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
    margin-bottom: 1.8rem;
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
    line-height: 1.5;
    font-size: 1.8rem;
  }
}

.artists {
  font-size: 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  justify-content: space-between;

  h3 {
    font-size: 1.8rem;
    font-weight: 500;

    .artist-count {
      color: general.$primary-font-color;
      font-size: 3rem;
    }
  }

  .top-artists {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .more {
    align-self: flex-end;
    text-align: end;
    width: 100%;
  }
}
</style>
