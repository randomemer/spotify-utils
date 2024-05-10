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

  // Database models

  interface UserModel {
    id: string;
    username: string;
    displayName: string;
    picture: string | null;
    createdAt: string;
    updatedAt: string;
  }

  interface FriendRequestModel {
    id: string;
    userOne: string;
    userTwo: string;
    requestor: "user1" | "user2";
    createdAt: string;
  }

  interface UserFriendModel {
    id: string;
    userId: string;
    friendId: string;
    createdAt: string;
  }

  interface PlaylistModel {
    playlistId: string;
    snapshotId: string;
    analysis: PlaylistAnalysis;
    artists: ArtistItemData[];
    createdAt: string;
  }

  interface RecommendModel {
    id: string;
    userId: string;
    data: SpotifyApi.RecommendationsObject;
    createdAt: string;
  }

  // Insert Models

  type InsertUserModel = Omit<UserRecord, "createdAt" | "updatedAt">;

  type InsertFriendRequestModel = Omit<FriendRequestModel, "createdAt">;

  type InsertUserFriendModel = Omit<UserFriendModel, "createdAt">;

  type InsertPlaylistModel = Omit<PlaylistModel, "createdAt">;

  type InsertRecommendModel = Omit<RecommendModel, "createdAt">;
}

export {};
