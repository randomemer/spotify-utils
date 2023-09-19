import { SpotifyTimeRange } from "~/types";

export const PAGE_LIMIT = 50;

export const TIME_RANGE_ITEMS = [
  { label: "All Time", value: SpotifyTimeRange.LongTerm },
  { label: "Medium Term", value: SpotifyTimeRange.MediumTerm },
  { label: "Short Term", value: SpotifyTimeRange.ShortTerm },
];
