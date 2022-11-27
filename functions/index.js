// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
import functions from "firebase-functions";

// The Firebase Admin SDK to access Firestore.
import admin from "firebase-admin";
import { getAccessToken, getRecentlyPlayedTracks } from "./utils.js";
admin.initializeApp();

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// exports.collectUserHistory = functions.runWith({
//   secrets: ["CLIENT_ID", "CLIENT_SECRET"],
// });

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
