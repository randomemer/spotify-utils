import getAdmin from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid User ID",
    });
  }

  const env = useRuntimeConfig();
  const admin = getAdmin(env.serviceAccKey);

  const docRef = admin.firestore().doc(`users/${id}`);
  const doc = await docRef.get();

  return combineDataAndId<UserDocument>(doc);
});
