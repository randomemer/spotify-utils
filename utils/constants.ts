import { SpotifyTimeRange } from "~/types";

export const PAGE_LIMIT = 50 as const;

export const TIME_RANGE_ITEMS = [
  { label: "All Time", value: SpotifyTimeRange.LongTerm },
  { label: "Medium Term", value: SpotifyTimeRange.MediumTerm },
  { label: "Short Term", value: SpotifyTimeRange.ShortTerm },
] as const;

export const SPOTIFY_SEARCH_FILTERS = [
  { label: "Tracks", value: "track" },
  { label: "Artists", value: "artist" },
  { label: "Genres", value: "genre" },
] as const;

export const NAV_LINKS = [
  {
    icon: "view-grid",
    label: "Dashboard",
    route: "app:dashboard",
  },
  {
    icon: "account-circle",
    label: "Account",
    route: "app:account",
  },
  {
    icon: "clock",
    label: "History",
    route: "app:history",
  },
  {
    icon: "magnify",
    label: "Recommends",
    route: "app:recommends",
  },
  {
    icon: "playlist-music",
    label: "Playlists",
    route: "app:playlists",
  },
];
