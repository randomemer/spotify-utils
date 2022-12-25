import { functions } from ".";
import { httpsCallable } from "firebase/functions";

export const fetchUserPlaybackHistory = httpsCallable(
  functions,
  "fetchUserPlaybackHistory"
);
