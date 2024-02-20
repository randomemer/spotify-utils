import getAdmin from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "No playlist ID was provided",
    });
  }

  const env = useRuntimeConfig();
  const admin = getAdmin(env.serviceAccKey);

  try {
    const data = await readBody(event);
    // const formData = await readMultipartFormData(event);
    // console.log(formData)

    const docRef = admin.firestore().doc(`users/${id}`);
    const resp = await docRef.update(data);
    return sendNoContent(event);
  } catch (error) {
    console.error(error);
    if (!(error instanceof Error)) return;

    if (error.message.includes("NOT_FOUND")) {
      throw createError({
        statusCode: 404,
        statusMessage: "Document Not Found",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
