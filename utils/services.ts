import type { AxiosInstance } from "axios";
import _ from "lodash";
import { PAGE_LIMIT } from "./constants";

interface ItemsGetterOptions {
  url: string;
  limit?: number | undefined;
  offset?: number | undefined;
  query?: Record<string, string> | undefined;
  max?: number | undefined;
}

export async function getAllItems<T = any>(
  axios: AxiosInstance,
  options: ItemsGetterOptions
) {
  const items: T[] = [];
  let lastResponse: SpotifyApi.PagingObject<T>;

  const config = _.defaults(options, { limit: 50, offset: 0 });
  let { offset } = config;

  do {
    const mergedQuery = _.merge(config.query ?? {}, {
      limit: config.limit.toString(),
      offset: offset.toString(),
    });
    const queryString = new URLSearchParams(mergedQuery);
    const { data } = await axios.get<SpotifyApi.PagingObject<T>>(
      `${config.url}?${queryString}`
    );
    lastResponse = data;

    items.push(...data.items);
    offset += config.limit;
    if (options.max && offset >= options.max) break;
  } while (lastResponse.next);

  return items;
}

export async function getTracksAudioFeatures(
  axios: AxiosInstance,
  tracks: SpotifyApi.TrackObjectFull[]
) {
  const ids = tracks.map((track) => track.id);
  const features: SpotifyApi.AudioFeaturesObject[] = [];

  while (ids.length > 0) {
    const batch = ids.splice(0, 100).join(",");
    const query = new URLSearchParams({ ids: batch });
    const resp = await axios.get<SpotifyApi.MultipleAudioFeaturesResponse>(
      `/audio-features?${query}`
    );

    features.push(...resp.data.audio_features);
  }

  return features;
}

export async function getTracksArtists(
  axios: AxiosInstance,
  tracks: (SpotifyApi.TrackObjectFull | SpotifyApi.TrackObjectSimplified)[]
) {
  let ids = tracks.flatMap((track) => track.artists.map((artist) => artist.id));
  ids = _.uniq(ids);

  const artists: SpotifyApi.ArtistObjectFull[] = [];

  while (ids.length > 0) {
    const query = new URLSearchParams({
      ids: ids.splice(0, 50).join(","),
    });
    const resp = await axios.get<SpotifyApi.MultipleArtistsResponse>(
      `/artists?${query}`
    );
    artists.push(...resp.data.artists);
  }

  return artists;
}

export async function getFullRecommendsData(
  axios: AxiosInstance,
  data: SpotifyApi.RecommendationsObject
) {
  const ids: Record<string, string[]> = {
    tracks: [],
    artists: [],
  };

  data.seeds.forEach((seed) => {
    if (seed.type.toLowerCase() === "track") {
      ids.tracks.push(seed.id);
    }
    if (seed.type.toLowerCase() === "artist") {
      ids.artists.push(seed.id);
    }
  });

  data.tracks.forEach((track) => {
    ids.tracks.push(track.id);
  });

  const tracksAll: SpotifyApi.TrackObjectFull[] = [];
  const artistsAll: SpotifyApi.ArtistObjectFull[] = [];

  // Get tracks
  while (ids.tracks.length > 0) {
    const trackIds = ids.tracks.splice(0, PAGE_LIMIT);
    const query = new URLSearchParams({
      ids: trackIds.join(","),
    });

    const resp = await axios.get<SpotifyApi.MultipleTracksResponse>(
      `tracks?${query}`
    );

    tracksAll.push(...resp.data.tracks);
  }

  // Get artists (if any)
  if (ids.artists.length > 0) {
    const artistsQuery = new URLSearchParams({
      ids: ids.artists.join(","),
    });
    const {
      data: { artists },
    } = await axios.get<SpotifyApi.MultipleArtistsResponse>(
      `/artists?${artistsQuery}`
    );
    artistsAll.push(...artists);
  }

  // Structure the data
  const seeds = data.seeds.map((s) => {
    if (s.type.toLowerCase() === "track") {
      return tracksAll.find((t) => t.id === s.id)!;
    } else if (s.type.toLowerCase() === "artist") {
      return artistsAll.find((a) => a.id === s.id)!;
    } else {
      return { id: s.id, type: s.type.toLowerCase(), genre: s.id };
    }
  }) as SeedSearchResult[];

  const tracks = data.tracks.map(
    (track) => tracksAll.find((t) => t.id === track.id)!
  );

  return {
    seeds,
    tracks,
  };
}
