import getAdmin from "~/server/utils/firebase";
import { apiClientPrivate } from "~/server/utils/spotify";
import { extractBearerToken } from "~/utils/helpers";
import { getFullRecommendsData } from "~/utils/services";

export default defineEventHandler(async (event) => {
  const query = event.path.split("?").at(-1);
  const token = extractBearerToken(event.headers.get("Authorization"));

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or absent token",
    });
  }

  if (!query) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid query",
    });
  }

  const spotifyApi = apiClientPrivate(token);

  // 1. Generate recommends
  const feedResp = await spotifyApi.get<SpotifyApi.RecommendationsObject>(
    `/recommendations?${query}`
  );

  // 2. Save to db
  const { serviceAccKey } = useRuntimeConfig(event);
  const db = getAdmin(serviceAccKey).firestore();

  const docRef = await db.collection("recommends").add({
    data: JSON.stringify(feedResp.data),
  });

  // 3. Get complete data for recommends
  const data = await getFullRecommendsData(spotifyApi, feedResp.data);

  return {
    id: docRef.id,
    data,
  };
});
