import type { AxiosInstance } from "axios";
import { SpotifyTimeRange } from "~/types";

export async function getAllTopTracks(
  axios: AxiosInstance,
  timeRange: SpotifyTimeRange
): Promise<SpotifyApi.TrackObjectFull[]> {
  const tracks = [];
  let lastResponse: SpotifyApi.UsersTopTracksResponse;

  do {
    const query = new URLSearchParams({
      limit: "50",
      offset: tracks.length.toString(),
      time_range: timeRange,
    });
    lastResponse = await axios.get(`me/top/tracks?${query}`);

    tracks.push(...lastResponse.items);
  } while (lastResponse.next);

  return tracks;
}
