import type { UserTopItemsSort } from "@/types/types";
import Spotify from "spotify-web-api-js";

export async function getAllTopTracks(
  sort: UserTopItemsSort,
  token: string
): Promise<SpotifyApi.TrackObjectFull[]> {
  const spotify = new Spotify();
  spotify.setAccessToken(token);

  const tracks = [];
  let lastResponse;

  do {
    lastResponse = await spotify.getMyTopTracks({
      limit: 50,
      offset: tracks.length,
      time_range: sort,
    });

    tracks.push(...lastResponse.items);
  } while (lastResponse.next);

  return tracks;
}

export function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function getUserProfileImage(user: SpotifyApi.UserProfileResponse) {
  return (user.images && user.images[0]?.url) || "../assets/default-pfp.jpeg";
}
