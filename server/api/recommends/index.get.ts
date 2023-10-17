import getAdmin from "~/server/utils/firebase";
import { apiClientPrivate } from "~/server/utils/spotify";
import { getFullRecommendsData } from "~/utils/services";

export default defineEventHandler(async (event) => {
  const token: string = event.context.token;
  const query = event.path.split("?").at(-1);

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
