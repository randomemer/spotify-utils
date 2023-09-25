import axios from "axios";

export async function apiClientPublic(clientId: string, clientSecret: string) {
  const formData = new URLSearchParams({
    grant_type: "client_credentials",
  });
  const authResp = await axios.post<BasicTokenResponse>(
    "https://accounts.spotify.com/api/token",
    formData.toString(),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
    }
  );

  return axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: { Authorization: `Bearer ${authResp.data.access_token}` },
  });
}

export function apiClientPrivate(accessToken: string) {
  return axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
