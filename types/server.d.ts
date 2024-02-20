import { HTTPMethod } from "h3";

declare global {
  // Auth
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

  interface KVUserSession {
    user_id: string;
    refresh_token: string;
    created_at: number;
    updated_at: number;
  }

  interface AuthToken {
    access_token: string;
    expiry: number;
  }

  interface UserSession {
    token: AuthToken;
    kv_data: KVUserSession;
  }

  // Documents
  interface UserDocument {
    username: string;
    display_name: string;
    friends: string[];
    created_at: number;
    picture: string | null;
  }

  interface RecommendsDocument {
    user: string;
    data: SpotifyApi.RecommendationsObject;
  }

  interface RecommendsDocumentSerialized {
    user: string;
    data: string;
  }

  interface PlaylistDocument {
    playlist_id: string;
    snapshot_id: string;
    analysis: PlaylistAnalysis;
    artists: ArtistItemData[];
  }

  type PathLike = string | RegExp;

  interface ProtectedRouteObject {
    path: PathLike;
    methods?: HTTPMethod[];
  }

  type ProtectedRoute = PathLike | ProtectedRouteObject;

  interface CreatePlaylistForm {
    user_id: string;
    name: string;
    public?: boolean | null;
    description?: string | null;
    tracks: string[];
    image?: File | null;
  }
}

export {};
