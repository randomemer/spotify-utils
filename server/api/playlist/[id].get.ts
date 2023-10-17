import _ from "lodash";
import getAdmin from "~/server/utils/firebase";
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
  const admin = getAdmin(env.serviceAccKey);

  // 1. Check existing analysis
  const collection = admin.firestore().collection("playlists");
  const docs = await collection
    .where("snapshot_id", "==", snapshot_id ?? "")
    .where("playlist_id", "==", id)
    .get();

  if (!docs.empty) {
    const docSnapshot = docs.docs[0].data();
    return docSnapshot;
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

  const resp: PlaylistDocument = {
    playlist_id: id,
    snapshot_id: playlistResp.data.snapshot_id,
    analysis,
    artists: artists.map((artist) =>
      _.pick(artist, ["id", "name", "images", "genres"])
    ),
  };

  // Save to firestore async
  (async function () {
    await collection.add(resp);
  })();

  return resp;
});
