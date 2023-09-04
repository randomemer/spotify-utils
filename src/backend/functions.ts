import { firebaseApp } from ".";
import { getFunctions, httpsCallable } from "firebase/functions";

const functionsAsia = getFunctions(firebaseApp, "asia-south1");
export const fetchUserPlaybackHistory = httpsCallable(
  functionsAsia,
  "fetchUserPlaybackHistory"
);
