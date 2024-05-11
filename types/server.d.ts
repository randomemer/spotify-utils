import type { HTTPMethod } from "h3";

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

  interface PatchProfileResponse {
    username: string;
    picture: string;
  }

  interface FriendReqInput {
    recipient: string;
  }

  interface IncomingFriendReq {
    id: string;
    sender: SelectUser;
    createdAt: string;
  }

  interface OutgoingFriendReq {
    id: string;
    recipient: SelectUser;
    createdAt: string;
  }
}

export type {
  UserModel,
  InsertUserModel,
  FriendRequestModel,
  InsertFriendRequestModel,
  UserFriendModel,
  InsertUserFriendModel,
  PlaylistModel,
  InsertPlaylistModel,
  RecommendModel,
  InsertRecommendModel,
} from "~/server/database/schema";
