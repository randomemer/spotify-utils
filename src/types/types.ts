export enum UserTopItemsSort {
  Long = "long_term",
  Medium = "medium_term",
  Short = "short_term",
}

export type SpotifySearchFilter = "track" | "artist" | "genre";

export type AccountsCookie = {
  user: SpotifyApi.CurrentUsersProfileResponse;
  refresh_token: string;
}[];
