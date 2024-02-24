import _ from "lodash";
import getAdmin from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {
  const session: KVUserSession = event.context.session;
  const senderId = session.user_id;
  const body: FriendReqInput = await readBody(event);
  const recipientId = body.recipient;

  const env = useRuntimeConfig();
  const admin = getAdmin(env.serviceAccKey);
  const firestore = admin.firestore();

  // Check 1 : Existence of recipient
  const docRef = firestore.doc(`users/${recipientId}`);
  const recipientDoc = await docRef.get();
  if (!recipientDoc.exists) {
    throw createError({
      statusCode: 400,
      statusMessage: "This user doesn't exist",
    });
  }

  // Check 2 : Already friended
  const recipient = recipientDoc.data() as UserDocument;
  if (recipient.friends.includes(senderId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "This user is already friended",
    });
  }

  const { Filter } = admin.firestore;
  // Check 3 : Duplicate friend request
  const queryRef = firestore
    .collection("friend_requests")
    .where(
      Filter.and(
        Filter.where("sender", "==", senderId),
        Filter.where("recipient", "==", recipientId)
      )
    );
  const querySnap = await queryRef.get();

  if (!querySnap.empty) {
    throw createError({
      statusCode: 400,
      statusMessage: "Duplicate friend request",
    });
  }

  const data: FriendReqDocument = {
    sender: senderId,
    recipient: recipientId,
    status: "pending",
    created_at: Date.now(),
    updated_at: Date.now(),
  };
  await firestore.collection(`friend_requests`).add(data);
  return data;
});
