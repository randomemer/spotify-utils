declare global {
  interface UserState {
    token: AuthToken | null;
    spotifyProfile: SpotifyApi.CurrentUsersProfileResponse | null;
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
