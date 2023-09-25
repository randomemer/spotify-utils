import getAdmin from "~/server/utils/firebase";
import { getFullRecommendsData } from "~/utils/services";

export default defineEventHandler(async (event) => {
  try {
    const params = event.context.params;
    const { spotifyClientId, spotifyClientSecret } = useRuntimeConfig(event);

    // 1.Get the doc
    const { serviceAccKey } = useRuntimeConfig(event);
    const db = getAdmin(serviceAccKey).firestore();

    const docRef = await db.doc(`recommends/${params!.id}`).get();
    const docData = docRef.data()!;

    // 2. Get spotify client
    const spotifyApi = await apiClientPublic(
      spotifyClientId,
      spotifyClientSecret
    );

    // 3. Get recommends data
    const data = await getFullRecommendsData(
      spotifyApi,
      JSON.parse(docData.data)
    );

    return {
      id: docRef.id,
      data,
    };
  } catch (error) {
    console.error(error);
  }
});
