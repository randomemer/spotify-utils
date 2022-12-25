// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
import functions from "firebase-functions";
// The Firebase Admin SDK to access Firestore.
import admin from "firebase-admin";
import {
  getAccessToken,
  getPlaybackRecords,
  getRecentlyPlayedTracks,
  updateUserHistory,
} from "./utils.js";
import os from "os";
import fs from "fs";
import path from "path";

admin.initializeApp();
// admin.functions().useFunctionsEmulator("http://localhost:5000");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

export const updateUsersHistory = functions
  .runWith({
    secrets: ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"],
  })
  .pubsub.schedule("every 25 minutes")
  .onRun(async () => {
    const collection = await admin.firestore().collection("users").get();
    const documents = collection.docs.slice();
    const bucket = admin.storage().bucket();

    // update user history in batches of 500 documents (batch-limit)
    while (documents.length > 0) {
      const batchDocs = documents.splice(0, 500);
      const writeBatch = admin.firestore().batch();

      for (const doc of batchDocs) {
        await updateUserHistory(doc, writeBatch, bucket);
      }

      await writeBatch.commit();
    }

    functions.logger.log(
      `Updated ${collection.docs.length} users' playback history.`
    );
    return null;
  });

export const onUserCreate = functions
  .runWith({
    secrets: ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"],
  })
  .firestore.document("users/{id}")
  .onCreate(async (snapshot) => {
    try {
      const refresh_token = snapshot.get("refresh_token");

      // request a token using their refresh token
      const access_token = await getAccessToken(refresh_token);
      if (!access_token) throw new Error("No Access Token Received");

      // get their history
      const history = await getRecentlyPlayedTracks(access_token);

      const document = snapshot.ref;
      const updateResult = await document.update("playback_history", {
        items: JSON.stringify(history.items),
        last_updated: admin.firestore.Timestamp.now(),
      });
      functions.logger.log(updateResult);
    } catch (error) {
      functions.logger.error(error);
    }
  });

export const fetchUserPlaybackHistory = functions
  .region("asia-south1")
  .https.onCall(async (data, context) => {
    // check if user is authenticated
    const uid = data.uid || context.auth?.uid;
    functions.logger.log(`Requested playback history for ${uid}`);
    if (!uid) {
      return {
        code: "401",
        status: "error",
        message: "user-not-authenticated",
      };
    }

    // verify the request cursors
    const { before, after } = data;
    if (before && after && before > after) {
      return {
        code: "400",
        status: "error",
        message: "invalid-cursors",
      };
    }

    const bucket = admin.storage().bucket();

    // get the parquet file from storage
    const storagePath = `playback-history/${uid}.parquet`;
    const localPath = path.join(os.tmpdir(), `${uid}.parquet`);
    await bucket.file(storagePath).download({ destination: localPath });

    const result = await getPlaybackRecords(localPath, { before, after });
    functions.logger.log(`${result?.length} items sent.`);

    fs.unlinkSync(localPath);

    return result;
  });
