import getAdmin from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "No playlist ID was provided",
    });
  }

  console.log("Retrieving user :", id);

  const env = useRuntimeConfig();
  const admin = getAdmin(env.serviceAccKey);

  const docRef = admin.firestore().doc(`users/${id}`);
  const doc = await docRef.get();

  return doc.data() as UserDocument;
});
