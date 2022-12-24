// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
import functions from "firebase-functions";
// The Firebase Admin SDK to access Firestore.
import admin from "firebase-admin";
import {
  getAccessToken,
  getRecentlyPlayedTracks,
  updateUserHistory,
} from "./utils.js";

admin.initializeApp();

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

    console.log(`Updated ${collection.docs.length} users' playback history.`);
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
      console.log("access token :", access_token);
      if (!access_token) throw new Error("No Access Token Received");

      // get their history
      const history = await getRecentlyPlayedTracks(access_token);

      const document = snapshot.ref;
      const updateResult = await document.update("playback_history", {
        items: JSON.stringify(history.items),
        last_updated: admin.firestore.Timestamp.now(),
      });
      console.log(updateResult);
    } catch (error) {
      console.error(error);
    }
  });
