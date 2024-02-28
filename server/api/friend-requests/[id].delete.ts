import { H3Error } from "h3";
import getAdmin from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {
  const env = useRuntimeConfig();
  const admin = getAdmin(env.serviceAccKey);
  const firestore = admin.firestore();
  const session: KVUserSession = event.context.session;

  const id = event.context.params?.id;
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "No playlist ID was provided",
    });
  }

  try {
    const doc = await firestore.doc(`friend_requests/${id}`).get();
    // Check 1 : Existence
    if (!doc.exists) throw new Error("NOT_FOUND");

    const req = doc.data() as FriendReqDocument;
    console.log(req);
    // Check 2 : Ownership
    if (![req.sender, req.recipient].includes(session.user_id)) {
      throw createError({
        statusCode: 401,
        statusMessage: "Not authorized to perform this action",
      });
    }

    await doc.ref.delete();
  } catch (error) {
    console.error(error);
    if (error instanceof H3Error) throw error;
    if (!(error instanceof Error)) return;

    if (error.message.includes("NOT_FOUND")) {
      throw createError({
        statusCode: 404,
        statusMessage: "Friend Request Not Found",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
