import type { VueCookies } from "vue-cookies";

export {};

declare global {
  interface Window {
    $cookies: VueCookies;
  }

  type AccountCookie = {
    user: SpotifyApi.CurrentUsersProfileResponse;
    refresh_token: string;
  };

  type RecentlyPlayedTracks = SpotifyApi.CursorBasedPagingObject<
    SpotifyApi.PlayHistoryObject & { track: SpotifyApi.TrackObjectFull }
  >;

  type SpotifySearchFilter = "track" | "artist" | "genre";

  type Seed = {
    seed: SpotifyApi.TrackObjectFull | SpotifyApi.ArtistObjectFull | string;
    type: SpotifySearchFilter;
  };
}
