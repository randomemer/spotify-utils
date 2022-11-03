import type { UserTopItemsSort } from "@/types/enums";
import { spotify } from "./spotify-api";

const client_id = import.meta.env.VITE_CLIENT_ID;
const client_secret = import.meta.env.VITE_CLIENT_SECRET;

export async function getAllTopTracks(
  sort: UserTopItemsSort
): Promise<SpotifyApi.TrackObjectFull[]> {
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

export async function getArtistsFromTracks(
  tracks: SpotifyApi.TrackObjectSimplified[]
) {
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

  return knownArtists;
}

export async function getGenresFromTracks(
  tracks: SpotifyApi.TrackObjectSimplified[]
) {
  const knownArtists = await getArtistsFromTracks(tracks);

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

export async function refreshAccessToken(
  accountJSON: string
): Promise<RefreshedAccessTokenResponse> {
  const account: Account = JSON.parse(accountJSON);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: account.refresh_token,
    }),
  });

  const body: RefreshedAccessTokenResponse = await response.json();
  sessionStorage.setItem("access_token", body.access_token);
  return body;
}

export async function retrieveSpotifyTokens(
  code: string
): Promise<AccessTokenResponse> {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: code.toString(),
      redirect_uri: `${location.origin}/auth`,
      grant_type: "authorization_code",
    }),
  });
  return await response.json();
}
