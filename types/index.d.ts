declare global {
  interface AccessTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
  }

  interface RefreshedAccessTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
  }

  interface UserSession {}

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

  interface TrackSeed {
    type: "track";
    id: string;
    seed: SpotifyApi.TrackObjectFull;
  }

  interface ArtistSeed {
    type: "artist";
    id: string;
    seed: SpotifyApi.ArtistObjectFull;
  }

  interface GenreSeed {
    type: "genre";
    id: string;
    seed: string;
  }

  type SpotifySearchSeed = TrackSeed | ArtistSeed | GenreSeed;

  type ElementType<T extends any[]> = T extends (infer U)[] ? U : never;
}

export {};
