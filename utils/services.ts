import type { AxiosInstance } from "axios";
import { SpotifyTimeRange } from "~/types";
import _ from "lodash";

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
    lastResponse = await axios.get(`/me/top/tracks?${query}`);

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

    artists.push(...resp.data.items);
  } while (lastResponse.next);

  return artists;
}
