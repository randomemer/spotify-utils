import axios from "axios";
import type { H3Event } from "h3";
import getAdmin from "./firebase";

export async function createSession(
  event: H3Event,
  tokenData: AccessTokenResponse
) {
  const userResp = await axios.get<SpotifyApi.CurrentUsersProfileResponse>(
    "https://api.spotify.com/v1/me",
    {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    }
  );

  const admin = getAdmin(event);
  const db = admin.firestore();
  const ts = admin.firestore.Timestamp.now();

  const doc = await db.collection("sessions").add({
    user_id: userResp.data.id,
    refresh_token: tokenData.refresh_token,
    created_at: ts,
    updated_at: ts,
  });

  setCookie(event, "session_id", doc.id, { httpOnly: true });
}

export async function fetchSession(event: H3Event) {
  const env = useRuntimeConfig(event);
  const sessionId = getCookie(event, "session_id");

  if (!sessionId) {
    throw createError({ statusCode: 401, statusMessage: "User not logged in" });
  }

  // 1. fetch session
  const db = getAdmin(event).firestore();
  const sessionDoc = await db.collection("sessions").doc(sessionId).get();

  if (!sessionDoc.exists) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not logged in",
    });
  }

  const session = sessionDoc.data()!;

  // 2. fetch access token using session
  const encoded = Buffer.from(
    `${env.spotifyClientId}:${env.spotifyClientSecret}`
  ).toString("base64");

  const formData = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: session.refresh_token,
  });

  const tokenResp = await axios.post<RefreshedAccessTokenResponse>(
    `https://accounts.spotify.com/api/token`,
    formData.toString(),
    {
      headers: {
        Authorization: `Basic ${encoded}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return {
    access_token: tokenResp.data.access_token,
  };
}
