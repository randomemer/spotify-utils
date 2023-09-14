import _ from "lodash";

export function getChartColors(shade: number) {
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
  baseColors.push("gray");
  const styles = getComputedStyle(document.body);

  return baseColors.map((color) => {
    const cssVarName = `--${color}-${shade}`;
    return styles.getPropertyValue(cssVarName);
  });
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
