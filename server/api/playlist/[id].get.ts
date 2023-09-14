import axios, { AxiosError } from "axios";
import { extractBearerToken } from "~/utils/helpers";
import { getAllItems } from "~/utils/services";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const token = extractBearerToken(event.headers.get("Authorization"));

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or absent token",
    });
  }

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "No playlist ID was provided",
    });
  }

  const spotifyApi = axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  try {
    const tracks = await getAllItems<SpotifyApi.TrackObjectFull>(
      spotifyApi,
      `/playlists/${id}/tracks`,
      {
        limit: "100",
      }
    );
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response);
    }
    throw error;
  }

  // console.log(tracks[0], tracks.length);
});
