import type SpotifyWebApi from "spotify-web-api-js";
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

  interface AccessTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
  }

  interface AppTokens {
    tokens: Ref<Promise<RefreshedAccessTokenResponse | undefined>>;
    updateTokens(): void;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $spotify: SpotifyWebApi.SpotifyWebApiJs;
  }

  interface VueConstructor {
    $spotify: SpotifyWebApi.SpotifyWebApiJs;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $spotify: SpotifyWebApi.SpotifyWebApiJs;
  }
}
