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

  type SeedItem =
    | SpotifyApi.TrackObjectFull
    | SpotifyApi.ArtistObjectFull
    | string;

  type PlaylistItem = SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull;

  type Seed =
    | {
        id: string;
        seed: SpotifyApi.TrackObjectFull;
        type: "track";
      }
    | {
        id: string;
        seed: SpotifyApi.ArtistObjectFull;
        type: "artist";
      }
    | {
        id: string;
        seed: string;
        type: "genre";
      };

  type RecommendationsSeedObject =
    | (Omit<SpotifyApi.RecommendationsSeedObject, "type"> & {
        type: "TRACK";
        item: SpotifyApi.TrackObjectFull;
      })
    | (Omit<SpotifyApi.RecommendationsSeedObject, "type"> & {
        type: "ARTIST";
        item: SpotifyApi.ArtistObjectFull;
      })
    | (Omit<SpotifyApi.RecommendationsSeedObject, "type"> & {
        type: "GENRE";
        item: string;
      });

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

  interface PlaylistAnalysis {
    genres: [string, number][];
    artists: SpotifyApi.ArtistObjectFull[];
    avgPopularity: number;
    items: SpotifyApi.PlaylistTrackObject[];
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
