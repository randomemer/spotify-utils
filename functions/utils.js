import got from "got";

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

export async function getRecentlyPlayedTracks(access_token) {
  const url = "https://api.spotify.com/v1/me/player/recently-played";
  const response = await got.get(url, {
    searchParams: { limit: 50 },
    headers: { Authorization: `Bearer ${access_token}` },
    resolveBodyOnly: true,
    responseType: "json",
  });

  console.log(response);

  return response;
}
