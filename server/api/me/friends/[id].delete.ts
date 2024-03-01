import getAdmin from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {
  const session: KVUserSession = event.context.session;

  const env = useRuntimeConfig();
  const admin = getAdmin(env.serviceAccKey);
  const firestore = admin.firestore();
  const { Filter } = admin.firestore;

  const id = event.context.params?.id;
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "No user ID was provided",
    });
  }

  const query = firestore
    .collection("friend_requests")
    .where(
      Filter.and(
        Filter.where("status", "==", "accepted"),
        Filter.or(
          Filter.and(
            Filter.where("sender", "==", session.user_id),
            Filter.where("recipient", "==", id)
          ),
          Filter.and(
            Filter.where("sender", "==", id),
            Filter.where("recipient", "==", session.user_id)
          )
        )
      )
    );
  const snaps = await query.get();
  if (snaps.empty) {
    throw createError({ statusCode: 404, statusMessage: "Friend Not Found" });
  }

  const doc = snaps.docs[0];
  console.log("Deleting request", doc.data());
  await doc.ref.delete();
});
