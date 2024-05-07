import { getFullRecommendsData } from "~/utils/services";

export default defineEventHandler(async (event) => {
  try {
    const params = event.context.params;
    const { spotifyClientId, spotifyClientSecret } = useRuntimeConfig(event);

    // 1. Get the record
    const config = useRuntimeConfig(event);
    const db = await useDrizzle(config);

    const recommend = await db.query.recommends.findFirst({
      where: (fields, { eq }) => eq(fields.id, params!.id),
    });

    if (!recommend) {
      throw createError({
        statusCode: 404,
        statusMessage: "Recommend not found",
      });
    }

    // 2. Get spotify client
    const spotifyApi = await apiClientPublic(
      spotifyClientId,
      spotifyClientSecret
    );

    // 3. Get recommends data
    const data = await getFullRecommendsData(spotifyApi, recommend.data);

    return { id: recommend.id, data };
  } catch (error) {
    console.error(error);
  }
});
