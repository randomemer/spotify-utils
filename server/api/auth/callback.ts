import axios from "axios";
import SpotifyWebApi from "spotify-web-api-js";
import getAdmin from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const env = useRuntimeConfig(event);
    const code = query.code;

    // get tokens
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

    // get user
    const userResp = await axios.get<SpotifyApi.CurrentUsersProfileResponse>(
      "https://api.spotify.com/v1/me",
      {
        headers: { Authorization: `Bearer ${tokenResp.data.access_token}` },
      }
    );

    // create and save in db
    const admin = getAdmin(event);
    const fbResp = await admin.firestore().listCollections();
    for (const item of fbResp) {
      console.log(item.path);
    }

    return userResp.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
