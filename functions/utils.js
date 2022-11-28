import got from "got";
import admin from "firebase-admin";

export async function getAccessToken(refresh_token) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const url = "https://accounts.spotify.com/api/token";
  const data = {
    grant_type: "refresh_token",
    refresh_token,
  };

  const response = await got.post(url, {
    username: client_id,
    password: client_secret,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: data,
    resolveBodyOnly: true,
    responseType: "json",
  });

  return response.access_token;
}

export async function getRecentlyPlayedTracks(access_token, after) {
  const url = "https://api.spotify.com/v1/me/player/recently-played";
  const response = await got.get(url, {
    searchParams: { limit: 50, after },
    headers: { Authorization: `Bearer ${access_token}` },
    resolveBodyOnly: true,
    responseType: "json",
  });

  return response;
}

export async function updateUserHistory(doc, writeBatch) {
  const refresh_token = doc.get("refresh_token");
  const playback_history = doc.get("playback_history");

  const last_updated = playback_history.last_updated;
  const prev_tracks = JSON.parse(playback_history.items);

  // get access token
  const access_token = await getAccessToken(refresh_token);

  // get history after the last updated value
  const next_tracks = await getRecentlyPlayedTracks(
    access_token,
    last_updated.toMillis()
  );

  playback_history.last_updated = admin.firestore.Timestamp.now();
  const updated_tracks = [...next_tracks.items, ...prev_tracks];
  playback_history.items = JSON.stringify(updated_tracks);

  // update the document
  writeBatch.update(doc.ref, { playback_history });
}
