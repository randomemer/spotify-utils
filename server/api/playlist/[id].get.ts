import axios from "axios";
import getAdmin from "~/server/utils/firebase";
import { extractBearerToken } from "~/utils/helpers";
import { getAllItems } from "~/utils/services";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const token = extractBearerToken(event.headers.get("Authorization"));

  const query = getQuery(event);
  const snapshot_id = query.snapshot_id?.toString();

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or absent token",
    });
  }

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "No playlist ID was provided",
    });
  }

  const env = useRuntimeConfig();
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

  const spotifyApi = axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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

  console.log(playlistItems[0].track);
  console.log("total", playlistItems.length);

  // 4. Get all track features

  // 5. Get all artists

  // console.log(tracks[0], tracks.length);
});
