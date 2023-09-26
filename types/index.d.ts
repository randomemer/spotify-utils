declare global {
  interface AccessTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
  }

  interface BasicTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
  }

  interface RefreshedAccessTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
  }

  interface UserSession {
    user_id: string;
    refresh_token: string;
    created_at: number;
    updated_at: number;
  }

  interface AuthToken {
    access_token: string;
    expiry: number;
  }

  interface AuthState {
    token: AuthToken | null;
  }

  type LoginResp =
    | {
        status: "redirect";
        url: string;
      }
    | {
        status: "success";
        payload: {
          access_token: string;
          expiry: number;
        };
      };

  interface TrackItemData {
    id: string;
    name: string;
  }

  interface ArtistItemData {
    id: string;
    name: string;
    genres: string[];
    images: SpotifyApi.ImageObject[];
  }

  interface PlaylistAnalysis {
    audio_features: Record<string, number>;
    artists: { diversity_index: number; counts: Record<string, number> };
    genres: { diversity_index: number; counts: Record<string, number> };
    avg_popularity: number;
    avg_track_length: number;
  }

  interface PlaylistAnalysisResponse {
    playlist_id: string;
    snapshot_id: string;
    analysis: PlaylistAnalysis;
    artists: ArtistItemData[];
  }

  interface CreatePlaylistAnalysisInput {
    tracks: SpotifyApi.TrackObjectFull[];
    artists: SpotifyApi.ArtistObjectFull[];
    features: SpotifyApi.AudioFeaturesObject[];
    selectedFeatures: string[];
  }

  type ElementType<T extends any[]> = T extends (infer U)[] ? U : never;

  interface GenreObject {
    id: string;
    type: "genre";
    genre: string;
  }

  type SeedSearchResult =
    | SpotifyApi.TrackObjectFull
    | SpotifyApi.ArtistObjectFull
    | GenreObject;

  interface RecommendsData {
    id: string;
    data: SpotifyApi.RecommendationsObject;
  }

  interface RecommendsDataFull {
    id: string;
    data: {
      seeds: SeedSearchResult[];
      tracks: SpotifyApi.TrackObjectFull[];
    };
  }

  interface CacheStoreState {
    recommends: Record<string, RecommendsDataFull | undefined>;
  }
}

export {};
