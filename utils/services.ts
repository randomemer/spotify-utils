import type { AxiosInstance } from "axios";
import _ from "lodash";

interface ItemsGetterOptions {
  url: string;
  limit?: number | undefined;
  offset?: number | undefined;
  query?: Record<string, string> | undefined;
}

export async function getAllItems<T = any>(
  axios: AxiosInstance,
  options: ItemsGetterOptions
) {
  const items: T[] = [];
  let lastResponse: SpotifyApi.PagingObject<T>;

  const config = _.defaults(options, { limit: 50, offset: 0 });
  let { offset } = config;

  do {
    const mergedQuery = _.merge(config.query ?? {}, {
      limit: config.limit.toString(),
      offset: offset.toString(),
    });
    const queryString = new URLSearchParams(mergedQuery);
    const { data } = await axios.get<SpotifyApi.PagingObject<T>>(
      `${config.url}?${queryString}`
    );
    lastResponse = data;

    items.push(...data.items);
    offset += config.limit;
  } while (lastResponse.next);

  return items;
}

export async function getTracksAudioFeatures(
  axios: AxiosInstance,
  tracks: SpotifyApi.TrackObjectFull[]
) {
  const ids = tracks.map((track) => track.id);
  const features: SpotifyApi.AudioFeaturesObject[] = [];

  while (ids.length > 0) {
    const batch = ids.splice(0, 100).join(",");
    const query = new URLSearchParams({ ids: batch });
    const resp = await axios.get<SpotifyApi.MultipleAudioFeaturesResponse>(
      `/audio-features?${query}`
    );

    features.push(...resp.data.audio_features);
  }

  return features;
}

export async function getTracksArtists(
  axios: AxiosInstance,
  tracks: (SpotifyApi.TrackObjectFull | SpotifyApi.TrackObjectSimplified)[]
) {
  let ids = tracks.flatMap((track) => track.artists.map((artist) => artist.id));
  ids = _.uniq(ids);

  const artists: SpotifyApi.ArtistObjectFull[] = [];

  while (ids.length > 0) {
    const query = new URLSearchParams({
      ids: ids.splice(0, 50).join(","),
    });
    const resp = await axios.get<SpotifyApi.MultipleArtistsResponse>(
      `/artists?${query}`
    );
    artists.push(...resp.data.artists);
  }

  return artists;
}
