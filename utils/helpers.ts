import _ from "lodash";
// @ts-ignore
import colors from "vuetify/lib/util/colors.mjs";

export function getChartColors(shade: string) {
  let baseColors = [
    "blue",
    "green",
    "yellow",
    "cyan",
    "pink",
    "indigo",
    "teal",
    "orange",
    "purple",
    "red",
  ];
  baseColors = _.shuffle(baseColors);
  baseColors.push("grey");

  return baseColors.map((color) => colors[color][shade]);
}

export function getGenresFromArtists(artists: SpotifyApi.ArtistObjectFull[]) {
  const genres = _.flatMapDeep(artists, (val) => val.genres);
  const genreCounts = _.countBy(genres);

  const pairs = _.toPairs(genreCounts);
  return _.sortBy(pairs, (pair) => -pair[1]);
}

export function getFeaturesFromTracks(
  labels: string[],
  features: SpotifyApi.AudioFeaturesObject[]
) {
  const sums = _.reduce(
    features,
    (res, track) => {
      for (const label of labels) {
        res[label] =
          (res[label] || 0) +
          (track[label as keyof SpotifyApi.AudioFeaturesObject] as number);
      }
      return res;
    },
    {} as Record<string, number>
  );

  return _.mapValues(sums, (sum) => sum / features.length);
}

export function calcDiversityIndex(counts: Record<string, number>) {
  const values = _.values(counts);
  const total = _.sum(values);

  return _.sumBy(values, (val) => Math.pow(val / total, 2));
}

export function extractBearerToken(header: string | null | undefined) {
  if (!header) return null;

  const matches = header.match(/Bearer\s+([^\s]+)/i);

  if (matches && matches.length > 1) {
    return matches[1];
  }

  return null;
}

export function extractPlaylistId(str: string) {
  const url = new URL(str);

  if (url.origin !== "https://open.spotify.com") {
    throw new Error("Not a valid playlist link");
  }

  const pattern = /^\/playlist\/([\w-]+)/;
  const match = url.pathname.match(pattern);

  if (!match || match.length < 2) {
    throw new Error("Not a valid playlist link");
  }

  return match[1];
}

export function createPlaylistAnalysis(
  input: CreatePlaylistAnalysisInput
): PlaylistAnalysis {
  const avg_track_length = _.meanBy(input.tracks, (track) => track.duration_ms);
  const avg_popularity = _.meanBy(input.tracks, (track) => track.popularity);

  const genreCounts = _.fromPairs(getGenresFromArtists(input.artists));
  const genreDiversity = calcDiversityIndex(genreCounts);

  const artistCounts = _.countBy(input.artists.map((a) => a.id));
  const artistDiveristy = calcDiversityIndex(artistCounts);

  return {
    audio_features: getFeaturesFromTracks(
      input.selectedFeatures,
      input.features
    ),
    genres: {
      counts: genreCounts,
      diversity_index: genreDiversity,
    },
    artists: {
      counts: artistCounts,
      diversity_index: artistDiveristy,
    },
    avg_popularity,
    avg_track_length,
  };
}
