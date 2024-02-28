import getAdmin from "~/server/utils/firebase";
import admin from "firebase-admin";

export default defineEventHandler(async (event) => {
  const { user_id }: KVUserSession = event.context.session;
  const env = useRuntimeConfig();
  const admin = getAdmin(env.serviceAccKey);
  const firestore = admin.firestore();

  // 1. Fetch existing friends' profiles
  const friendsQuery = firestore
    .collection("users")
    .where("friends", "array-contains", user_id);
  const friendsQuerySnap = await friendsQuery.get();
  const friends = friendsQuerySnap.docs.map(
    (doc) => doc.data() as UserDocument
  );

  // 2. Fetch incoming and outgoing requests
  const requests = await fetchFriendRequests(user_id, firestore);

  return {
    friends,
    ...requests,
  };
});

async function fetchFriendRequests(
  user_id: string,
  firestore: FirebaseFirestore.Firestore
) {
  const { Filter, FieldPath } = admin.firestore;

  // Fetch incoming and outgoing requests
  const reqsQuery = firestore
    .collection("friend_requests")
    .where(
      Filter.and(
        Filter.where("status", "==", "pending"),
        Filter.or(
          Filter.where("sender", "==", user_id),
          Filter.where("recipient", "==", user_id)
        )
      )
    );
  const reqsQuerySnap = await reqsQuery.get();
  const reqs = reqsQuerySnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as FriendReqDocument),
  }));

  // Fetch profiles of requests
  const ids = new Set();
  reqs.forEach((req) => {
    ids.add(req.sender);
    ids.add(req.recipient);
  });
  ids.delete(user_id);

  const profilesQuery = firestore
    .collection("users")
    .where(FieldPath.documentId(), "in", [...ids]);
  const profilesSnap = await profilesQuery.get();

  const incoming = reqs
    .filter((req) => req.recipient === user_id)
    .map((req) => {
      return {
        id: req.id,
        sender_id: req.sender,
        profile: profilesSnap.docs
          .find((doc) => doc.id === req.sender)
          ?.data() as UserDocument,
        created_at: req.created_at,
        updated_at: req.updated_at,
      } as IncomingFriendReq;
    });

  const outgoing = reqs
    .filter((req) => req.sender === user_id)
    .map((req) => {
      return {
        id: req.id,
        recipient_id: req.recipient,
        profile: profilesSnap.docs
          .find((doc) => doc.id === req.recipient)
          ?.data() as UserDocument,
        created_at: req.created_at,
        updated_at: req.updated_at,
      } as OutgoingFriendReq;
    });

  return { incoming, outgoing };
}
