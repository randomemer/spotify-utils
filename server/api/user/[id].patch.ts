import getAdmin from "~/server/utils/firebase";
import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
  const session: KVUserSession = event.context.session;

  const env = useRuntimeConfig();
  const admin = getAdmin(env.serviceAccKey);

  try {
    const formData = await readMultipartFormData(event);
    if (!formData) return;

    const data = new Map();
    for (const field of formData) {
      // Upload to bucket and set URL
      if (field.name === "picture") {
        const ext = field.type?.split("/").at(-1);

        const url = await uploadObject(
          `images/${session.user_id}/${uuidv4()}.${ext}`,
          field.data,
          env.serviceAccKey,
          env.storageBucket
        );
        data.set(field.name, url);
      }
      if (field.name === "username") {
        data.set(field.filename, field.data.toString("utf8"));
      }
    }

    if (data.size === 0) return;

    // Update firestore document
    const json = Object.fromEntries(data.entries());
    const docRef = admin.firestore().doc(`users/${session.user_id}`);

    await docRef.update(json);
    return json;
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
