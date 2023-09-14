import type { AxiosInstance } from "axios";
import { SpotifyTimeRange } from "~/types";
import _ from "lodash";

export async function getAllItems<T = any>(
  axios: AxiosInstance,
  url: string,
  query?: Record<string, any>
) {
  const items: T[] = [];
  let lastResponse: SpotifyApi.PagingObject<T>;

  do {
    const mergedQuery = _.merge(
      { limit: "50", offset: items.length.toString() },
      query
    );
    const queryString = new URLSearchParams(mergedQuery);
    const { data } = await axios.get<SpotifyApi.PagingObject<T>>(
      `${url}?${queryString}`
    );
    lastResponse = data;

    items.push(...data.items);
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
