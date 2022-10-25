import type { UserTopItemsSort } from "@/types/enums";
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

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function decodeCookie(cookie: string): string {
  try {
    const obj = JSON.parse(cookie);
    return obj;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return cookie;
    } else {
      return "";
    }
  }
}
