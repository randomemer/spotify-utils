import type { AxiosInstance } from "axios";
import { SpotifyTimeRange } from "~/types";
import _ from "lodash";
import { LogarithmicScale } from "chart.js";

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

export async function getAllTopTracks(
  axios: AxiosInstance,
  timeRange: SpotifyTimeRange
) {
  const tracks: SpotifyApi.TrackObjectFull[] = [];
  let lastResponse: SpotifyApi.UsersTopTracksResponse;

  do {
    const query = new URLSearchParams({
      limit: "50",
      offset: tracks.length.toString(),
      time_range: timeRange,
    });
    const resp = await axios.get<SpotifyApi.UsersTopTracksResponse>(
      `/me/top/tracks?${query}`
    );
    lastResponse = resp.data;

    tracks.push(...lastResponse.items);
  } while (lastResponse.next);

  return tracks;
}

export async function getAllTopArtists(
  axios: AxiosInstance,
  timeRange: SpotifyTimeRange
) {
  const artists: SpotifyApi.ArtistObjectFull[] = [];
  let lastResponse: SpotifyApi.UsersTopArtistsResponse;

  do {
    const query = new URLSearchParams({
      limit: "50",
      offset: artists.length.toString(),
      time_range: timeRange,
    });
    const resp = await axios.get<SpotifyApi.UsersTopArtistsResponse>(
      `/me/top/artists?${query}`
    );
    lastResponse = resp.data;

    artists.push(...lastResponse.items);
  } while (lastResponse.next);

  return artists;
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
    const resp = await axios.get<{
      audio_features: SpotifyApi.AudioFeaturesObject[];
    }>(`/audio-features?${query}`);

    features.push(...resp.data.audio_features);
  }

  return features;
}
