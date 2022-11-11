<script lang="ts">
import ArtistItem from "@/components/ArtistItem.vue";
import PopularityBar from "@/components/PopularityBar.vue";
import AnalysisSkeleton from "@/components/playlists/AnalysisSkeleton.vue";
import TableEl from "@/components/table/TableEl.vue";
import TrackItem from "@/components/track/TrackItem.vue";
import { db } from "@/main";
import {
  convertRemToPixels,
  dateFormat,
  getArtistsFromTracks,
  getGenresFromTracks,
  timeFormat,
} from "@/utilities/functions";
import { IonIcon } from "@ionic/vue";
import {
  ArcElement,
  CategoryScale,
  Chart,
  Legend,
  Title,
  Tooltip,
} from "chart.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { chevronBack, chevronForward } from "ionicons/icons";
import { defineComponent } from "vue";
import { Doughnut } from "vue-chartjs";
import TracksTableSkeleton from "@/components/recommends/tracks-table/TracksTableSkeleton.vue";

Chart.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default defineComponent({
  components: {
    Doughnut,
    IonIcon,
    ArtistItem,
    TableEl,
    TrackItem,
    PopularityBar,
    AnalysisSkeleton,
    TracksTableSkeleton,
  },
  setup() {
    return { chevronBack, chevronForward };
  },
  data() {
    return {
      chartSize: 225,
      playlistID: "https://open.spotify.com/playlist/0LQN66XmARzQSM1XRCGWAU",
      state: "idle" as "loading" | "resolved" | "error" | "idle",
      // analysis data
      analysis: null as PlaylistAnalysis | null,
      playlist: null as SpotifyApi.PlaylistObjectFull | null,
      // pagination
      pageSize: 50,
      curPageNumber: 0,
    };
  },
  methods: {
    timeFormat,
    dateFormat,
    convertRemToPixels,
    changePage(pageNumber: number) {
      if (!this.analysis) return;
      const max = Math.ceil(this.analysis.items.length / this.pageSize);
      if (pageNumber <= max || pageNumber === 0) {
        this.curPageNumber = pageNumber;
      }
    },
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
      const items: SpotifyApi.PlaylistTrackObject[] = playlist.tracks.items;

      let response = playlist.tracks;

      while (response.offset + response.limit < response.total) {
        response = await this.$spotify.getPlaylistTracks(playlist.id, {
          offset: response.offset + response.limit,
          limit: response.limit,
        });

        items.push(...response.items);
      }

      return items;
    },
    async analyse(playlist: SpotifyApi.SinglePlaylistResponse) {
      // get all tracks
      const items = await this.getPlaylistTracks(playlist);
      const tracks = items
        .map((item) => item.track)
        .filter(
          (item) => item.type === "track"
        ) as SpotifyApi.TrackObjectFull[];

      // get all artists
      const artistsMap = await getArtistsFromTracks(tracks);
      const artists = this.getArtistsFreq(tracks, artistsMap);

      // get avg popularity
      const avgPopularity =
        tracks.reduce((prev, track) => prev + track.popularity, 0) /
        tracks.length;

      // get all genres
      const genres = await getGenresFromTracks(tracks);

      return {
        items,
        avgPopularity,
        artists,
        genres,
      };
    },
    async analyseWithMemo() {
      this.state = "loading";
      try {
        // get playlist id and snapshot data
        const id = this.extractID();
        const playlist = await this.$spotify.getPlaylist(id);
        this.playlist = playlist;

        let analysis: any;

        // re-use data or analyse freshly
        const document = await getDoc(doc(db, "playlists", id));
        if (
          document.exists() &&
          document.data().snapshot_id === playlist.snapshot_id
        ) {
          analysis = JSON.parse(document.data().analysis);
          console.log("analysis exists");
        } else {
          analysis = await this.analyse(playlist);

          // update analysis
          setDoc(doc(db, "playlists", id), {
            snapshot_id: playlist.snapshot_id,
            analysis: JSON.stringify(analysis),
            last_analysed: Date.now(),
          }).then((value) => console.log("analysed now : ", value));
        }

        this.analysis = analysis;
        this.state = "resolved";
      } catch (error) {
        this.state = "error";
        console.error(error);
      }
    },
  },
  computed: {
    startIndex(): number {
      return this.curPageNumber * this.pageSize;
    },
    endIndex(): number {
      return (this.curPageNumber + 1) * this.pageSize;
    },
    chartData(): any {
      const genres = this.analysis?.genres;
      if (!genres) return;

      // prettier-ignore
      const materialColours = ["#f44336", "#00bcd4", "#9c27b0", "#03a9f4", "#4caf50", "#e91e63", "#3f51b5", "#ffc107", "#673ab7", "#009688", "#bbbbbb"];

      return {
        labels: [...genres.slice(0, 10).map((genre) => genre[0]), "other"],
        datasets: [
          {
            backgroundColor: materialColours,
            data: [
              ...genres.slice(0, 10).map((genre) => genre[1]),
              genres.slice(10).reduce((prev, cur) => prev + cur[1], 0),
            ],
          },
        ],
      };
    },
    chartOptions(): any {
      const genres = this.analysis?.genres;
      if (!genres) return;
      const genreSum = genres.reduce((prev, cur) => prev + cur[1], 0);
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
    <input
      class="playlist-link-input"
      placeholder="Enter a playlist link"
      v-model.trim="playlistID"
      @keydown.enter="analyseWithMemo"
    />

    <AnalysisSkeleton v-if="state === 'loading'" />
    <div class="analysis" v-if="state === 'resolved'">
      <div class="first-col">
        <div
          class="basic-info card"
          :style="{
            background: `linear-gradient(rgba(115, 0, 153, 0.75), rgba(0, 0, 0, 0.75)), url('${playlist?.images[0].url}')`,
          }"
        >
          <h3 class="name">{{ playlist?.name }}</h3>
          <p class="desc">{{ playlist?.description }}</p>
        </div>

        <div class="avg-popularity card">
          <div class="top-row">
            <span class="avg-popularity-number"
              >{{ analysis!.avgPopularity?.toFixed(2) }}%</span
            >
            <div class="avg-popularity-bar">
              <div
                class="avg-popularity-bar-track"
                :style="{ width: `${analysis!.avgPopularity}%` }"
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
          <span class="genre-count">{{ analysis!.genres.length }}</span> genres!
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
          <span class="artist-count">{{ analysis!.artists?.length }}</span>
          different artists
        </h3>

        <div class="top-artists">
          <ArtistItem
            :artist="artist"
            :key="artist.id || i"
            v-for="(artist, i) in analysis!.artists.slice(0, 3)"
          />
        </div>

        <span
          class="more"
          v-if="analysis!.artists && analysis!.artists.length > 3"
        >
          and more ...
        </span>
      </div>
    </div>

    <TracksTableSkeleton v-if="state === 'loading'" />
    <TableEl v-if="state === 'resolved'" class="playlist-tracks">
      <template v-slot:thead>
        <tr>
          <th class="track-number">#</th>
          <th>Track</th>
          <th>Popularity</th>
          <th>Added At</th>
        </tr>
      </template>
      <template v-slot:tbody>
        <tr
          v-for="(item, index) in analysis!.items.slice(startIndex, endIndex)"
          :key="item.track.id"
        >
          <td class="track-number">{{ startIndex + index + 1 }}</td>
          <td class="track">
            <TrackItem :track="item.track" v-if="item.track.type === 'track'" />
          </td>
          <td>
            <PopularityBar
              :popularity="Number(item.track.popularity)"
              v-if="item.track.type === 'track'"
            />
          </td>
          <td>
            <div class="added-at">
              <span>{{ timeFormat(item.added_at) }}</span>
              <span>{{ dateFormat(item.added_at) }}</span>
            </div>
          </td>
        </tr>
      </template>
      <template v-slot:tfoot>
        <tr>
          <td class="table-footer">
            <div>
              <div class="button-group">
                <button
                  class="data-nav-button"
                  @click="changePage(curPageNumber - 1)"
                  :disabled="curPageNumber === 0"
                >
                  <ion-icon :icon="chevronBack"></ion-icon>
                </button>
                <span class="page-index">{{ curPageNumber + 1 }}</span>
                <button
                  class="data-nav-button"
                  @click="changePage(curPageNumber + 1)"
                  :disabled="
                    curPageNumber ===
                    Math.ceil(analysis!.items.length / pageSize) - 1
                  "
                >
                  <ion-icon :icon="chevronForward"></ion-icon>
                </button>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </TableEl>
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

.playlist-tracks {
  grid-template-columns: auto 1fr auto auto;

  .added-at {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .table-footer {
    padding: 1.6rem 0;
    border-top: 1px solid grey;
    grid-column: span 4;
    display: flex;
    align-items: center;
    justify-content: center;

    .button-group {
      display: flex;
      align-items: stretch;
      gap: 1.8rem;

      .page-index {
        font-size: 1.8rem;
        text-align: center;
        display: flex;
        align-items: center;
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
    }
  }
}
</style>
