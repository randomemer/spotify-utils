import getAdmin from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {
  const session: KVUserSession = event.context.session;

  const env = useRuntimeConfig();
  const admin = getAdmin(env.serviceAccKey);
  const firestore = admin.firestore();

  const id = event.context.params?.id;
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "No user ID was provided",
    });
  }

  const userDocRef = firestore.doc(`users/${session.user_id}`);
  const userDoc = await userDocRef.get();
  const userData = userDoc.data() as UserDocument;

  const friends = userData.friends.filter((friend) => friend !== id);
  await userDocRef.update({ friends });

  // TODO : Remove this user's ID from unfriended user's
  // friend array using firestore triggers
});
