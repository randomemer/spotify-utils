import axios from "axios";
import SpotifyWebApi from "spotify-web-api-js";
import { createSession } from "~/server/utils/session";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const env = useRuntimeConfig(event);
    const code = query.code;

    const encoded = Buffer.from(
      `${env.spotifyClientId}:${env.spotifyClientSecret}`
    ).toString("base64");

    const formData = new URLSearchParams({
      code: `${code}`,
      redirect_uri: "http://localhost:4009/api/auth/callback",
      grant_type: "authorization_code",
    });

    const tokenResp = await axios.post<AccessTokenResponse>(
      `https://accounts.spotify.com/api/token`,
      formData.toString(),
      {
        headers: {
          Authorization: `Basic ${encoded}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    await createSession(event, tokenResp.data);

    return sendRedirect(event, "/app");
  } catch (error) {
    console.error(error);
    throw error;
  }
});
