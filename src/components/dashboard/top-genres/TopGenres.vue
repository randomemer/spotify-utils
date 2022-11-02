<script lang="ts">
import { UserTopItemsSort } from "@/types/enums";
import { convertRemToPixels, getAllTopTracks } from "@/utilities/functions";
import { spotify } from "@/utilities/spotify-api";
import {
  ArcElement,
  CategoryScale,
  Chart,
  Legend,
  Title,
  Tooltip,
} from "chart.js";
import { defineComponent } from "vue";
import { Doughnut } from "vue-chartjs";

Chart.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export async function getTopGenres() {
  const tracks = await getAllTopTracks(UserTopItemsSort.Long);
  // console.log(tracks);

  // Collect all of the artists in the tracks
  const unknownArtists = new Set<string>();
  tracks.forEach((track) => {
    track.artists.forEach((artist) => {
      unknownArtists.add(artist.id);
    });
  });

  // Get artist data in batches of size 50 in accordance with Spotify API rate limits

  const knownArtists = new Map<string, SpotifyApi.ArtistObjectFull>();
  const artistsArr = Array.from(unknownArtists);
  do {
    const batch = await spotify.getArtists(artistsArr.splice(0, 50));
    batch.artists.forEach((artist) => knownArtists.set(artist.id, artist));
  } while (artistsArr.length > 0);

  const genres = new Map<string, number>();
  tracks.forEach((track) => {
    track.artists.forEach((artist) => {
      const artistInfo = knownArtists.get(artist.id);
      artistInfo?.genres.forEach((genre) => {
        const count = genres.get(genre);
        if (count) genres.set(genre, count + 1);
        else genres.set(genre, 1);
      });
    });
  });

  // calculated data
  const sortedGenres = Array.from(genres).sort(
    (genreA, genreB) => genreB[1] - genreA[1]
  );

  return sortedGenres;
}

// prettier-ignore
const materialColours = ["#f44336", "#00bcd4", "#9c27b0", "#03a9f4", "#4caf50", "#e91e63", "#3f51b5", "#ffc107", "#673ab7", "#009688", "#bbbbbb"];

export default defineComponent({
  components: { Doughnut },
  props: {
    genres: { required: true, type: Array<[string, number]> },
  },
  setup(props) {
    return {
      genreSum: props.genres.reduce((prev, cur) => prev + cur[1], 0),
    };
  },
  computed: {
    chartData(): any {
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
      const genreSum = this.genreSum;
      return {
        radius: convertRemToPixels(12.8),
        cutout: "60%",
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
  methods: {
    convertRemToPixels,
  },
});
</script>

<template>
  <div class="card">
    <h3 class="heading-tertiary">Your Top Genres</h3>

    <p class="summary">
      You've listened to {{ genres.length }} different genres.
    </p>

    <div class="donut-chart-container">
      <Doughnut
        :chart-data="chartData"
        :chart-options="chartOptions"
        chart-id="genres-donut"
        :height="convertRemToPixels(32)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./top-genres.scss";

.data-area {
  display: flex;
  gap: 4.8rem;
}

.summary {
  font-size: 1.6rem;
}

/* .donut-chart-container {
  display: flex;
  justify-content: space-between;
} */

/* :deep(#genres-donut) {
  background-color: grey;
} */

:deep(.donut-tooltip) {
  /* background-color: v-bind(tooltipColor); */
  text-transform: capitalize;
  font-size: 1.2rem;
  padding: 0.8rem;
  display: block;
}

.legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  list-style: none;
}

.genre {
  display: flex;
  gap: 1.2rem;
  font-size: 1.4rem;
  text-transform: capitalize;
}

.genre-colour {
  $size: 1.6rem;
  width: $size;
  height: $size;
  border-radius: $size;
}
</style>
