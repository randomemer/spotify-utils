import type { VueCookies } from "vue-cookies";

export {};

declare global {
  interface Window {
    $cookies: VueCookies;
  }

  interface Account {
    user: SpotifyApi.CurrentUsersProfileResponse;
    refresh_token: string;
  }

  type RecentlyPlayedTracks = SpotifyApi.CursorBasedPagingObject<
    SpotifyApi.PlayHistoryObject & { track: SpotifyApi.TrackObjectFull }
  >;

  type SpotifySearchFilter = "track" | "artist" | "genre";

  interface Seed {
    seed: SpotifyApi.TrackObjectFull | SpotifyApi.ArtistObjectFull | string;
    type: SpotifySearchFilter;
  }

  interface RefreshedAccessTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
  }

  interface AppTokens {
    tokens: Ref<Promise<RefreshedAccessTokenResponse | undefined>>;
    updateTokens(): void;
  }
}
