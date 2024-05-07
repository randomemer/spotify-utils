import { and, eq } from "drizzle-orm";
import _ from "lodash";
import { InsertPlaylist, playlists } from "~/server/database/schema";
import { createPlaylistAnalysis } from "~/utils/helpers";
import {
  getAllItems,
  getTracksArtists,
  getTracksAudioFeatures,
} from "~/utils/services";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const token = event.context.token;

  const query = getQuery(event);
  const snapshot_id = query.snapshot_id?.toString();

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "No playlist ID was provided",
    });
  }

  const env = useRuntimeConfig();
  const appConfig = useAppConfig(event);
  const db = await useDrizzle(env);

  // 1. Check existing analysis
  const condition = snapshot_id
    ? and(eq(playlists.playlistId, id), eq(playlists.snapshotId, snapshot_id))
    : eq(playlists.playlistId, id);
  const playlistArr = await db.select().from(playlists).where(condition);

  if (playlistArr.length > 0) {
    return playlistArr[0];
  }

  const spotifyApi = apiClientPrivate(token);

  // 2. Get playlist details
  const playlistResp = await spotifyApi.get<SpotifyApi.PlaylistObjectFull>(
    `/playlists/${id}`
  );

  // 3. Get all tracks from playlist
  const playlistItems = playlistResp.data.tracks.items;
  if (playlistResp.data.tracks.next) {
    const remainingItems = await getAllItems<SpotifyApi.PlaylistTrackObject>(
      spotifyApi,
      {
        url: `/playlists/${id}/tracks`,
        limit: 100,
        offset: playlistItems.length,
      }
    );
    playlistItems.push(...remainingItems);
  }

  const tracks = playlistItems
    .filter((item) => item.track.type === "track")
    .map((item) => item.track) as SpotifyApi.TrackObjectFull[];

  // 4. Get all track features
  const features = await getTracksAudioFeatures(spotifyApi, tracks);

  // 5. Get all artists
  const artists = await getTracksArtists(spotifyApi, tracks);

  // Final step : Make analysis and save in db
  const analysis = createPlaylistAnalysis({
    artists,
    features,
    tracks,
    selectedFeatures: appConfig.audioFeatures,
  });

  const resp: InsertPlaylist = {
    playlistId: id,
    snapshotId: playlistResp.data.snapshot_id,
    analysis,
    artists: artists.map((artist) =>
      _.pick(artist, ["id", "name", "images", "genres"])
    ),
  };
  // Save to database async
  (async () => await db.insert(playlists).values(resp))();

  return resp;
});
