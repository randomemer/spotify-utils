import * as admin from "firebase-admin";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { FriendReqDocument, UserDocument } from "./types";
import * as logger from "firebase-functions/logger";

export const onFriendReqAccepted = onDocumentUpdated(
  "friend_requests/{id}",
  async (event) => {
    if (!event.data) return;

    const start = Date.now();

    const doc = event.data.after;
    const req = doc.data() as FriendReqDocument;
    if (req.status !== "accepted") return;

    const firestore = admin.firestore();

    const senderRef = firestore.doc(`users/${req.sender}`);
    const senderDoc = await senderRef.get();
    const senderFriends = (senderDoc.data() as UserDocument).friends;
    await senderRef.update({ friends: [...senderFriends, req.recipient] });

    const recipientRef = firestore.doc(`users/${req.recipient}`);
    const recipientDoc = await recipientRef.get();
    const recipientFriends = (recipientDoc.data() as UserDocument).friends;
    await senderRef.update({ friends: [...recipientFriends, req.sender] });

    const elasped = Date.now() - start;
    logger.log(`Request : ${doc.id}, Elasped : ${elasped} ms`);
  }
);

// 1. function for friend delete as well
export const onFriendRemove = onDocumentUpdated(
  "friend_requests/{id}",
  async (event) => {}
);
