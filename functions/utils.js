import admin from "firebase-admin";
import functions from "firebase-functions";
import fs from "fs";
import got from "got";
import _ from "lodash";
import os from "os";
import Parquet from "parquetjs";
import path from "path";

const history_schema = new Parquet.ParquetSchema({
  context: { type: "JSON", optional: true },
  played_at: { type: "UTF8" },
  track: { type: "JSON" },
});

const history_track_schema = [
  "album.href",
  "album.id",
  "album.images",
  "album.name",
  "album.type",
  "album.uri",
  "artists",
  "external_urls",
  "href",
  "id",
  "is_local",
  "name",
  "popularity",
  "type",
  "uri",
];

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

export async function updateUserHistory(doc, writeBatch, bucket) {
  try {
    const refresh_token = doc.get("refresh_token");
    const playback_history = doc.get("playback_history");

    const { last_updated, location } = playback_history;

    // get access token
    const access_token = await getAccessToken(refresh_token);

    // get history after the last updated value
    const next_tracks = await getRecentlyPlayedTracks(
      access_token,
      last_updated.toMillis()
    );
    playback_history.last_updated = admin.firestore.Timestamp.now();

    // trim all items of unused fields
    const { items } = next_tracks;
    _.forEach(items, (item) => {
      item.track = _.pick(item.track, history_track_schema);
    });

    // download the parquet file
    const tempFilePath = path.join(os.tmpdir(), `${doc.id}.parquet`);
    await bucket.file(location).download({ destination: tempFilePath });

    // read all existing all existing records
    const reader = await Parquet.ParquetReader.openFile(tempFilePath);
    const cursor = reader.getCursor();
    let record;
    while ((record = await cursor.next())) {
      items.push(record);
    }
    await reader.close();

    // add records to the parquet file
    const writer = await Parquet.ParquetWriter.openFile(
      history_schema,
      tempFilePath
    );
    for (const item of items) {
      await writer.appendRow(item);
    }
    await writer.close();

    // upload the parquet file
    await bucket.upload(tempFilePath, { destination: location });
    fs.unlinkSync(tempFilePath);

    // update the document
    writeBatch.update(doc.ref, { playback_history });
  } catch (error) {
    functions.logger.error(error);
  }
}
