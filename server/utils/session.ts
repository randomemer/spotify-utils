import axios from "axios";
import { setCookie, type H3Event } from "h3";
import SpotifyWebApi from "spotify-web-api-js";
import { kv } from "@vercel/kv";

export async function createSession(
  event: H3Event,
  config: Record<string, string>,
  tokenData: AccessTokenResponse
) {
  const userResp = await axios.get<SpotifyApi.CurrentUsersProfileResponse>(
    "https://api.spotify.com/v1/me",
    {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    }
  );

  const ts = Date.now();

  const session = {
    user_id: userResp.data.id,
    refresh_token: tokenData.refresh_token,
    created_at: ts,
    updated_at: ts,
  };

  const kvRes = await kv.set(userResp.data.id, session);
  console.log("kvRes", kvRes);

  setCookie(event, "session_id", userResp.data.id, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60,
  });
}

export async function fetchSession(
  config: Record<string, string>,
  sessionId: string
) {
  if (!sessionId) {
    throw createError({ statusCode: 401, statusMessage: "User not logged in" });
  }

  // 1. fetch session
  console.time("kv");
  const session = await kv.get<UserSession>(sessionId);
  console.timeEnd("kv");

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not logged in",
    });
  }

  // 2. fetch access token using session
  const encoded = Buffer.from(
    `${config.spotifyClientId}:${config.spotifyClientSecret}`
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
    expiry: Date.now() + tokenResp.data.expires_in * 1000,
  };
}
