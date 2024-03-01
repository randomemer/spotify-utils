import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import {
  onDocumentDeleted,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import { FriendReqDocument, UserDocument } from "./types";
import { removeFriend } from "./utils";

export const onFriendReqAccepted = onDocumentUpdated(
  "friend_requests/{id}",
  async (event) => {
    if (!event.data) return;

    const start = Date.now();

    const doc = event.data.after;
    const req = doc.data() as FriendReqDocument;
    if (req.status !== "accepted") return;

    const firestore = admin.firestore();

    // Add to sender's friend list
    const senderRef = firestore.doc(`users/${req.sender}`);
    const senderDoc = await senderRef.get();
    const senderFriends = (senderDoc.data() as UserDocument).friends;
    await senderRef.update({ friends: [...senderFriends, req.recipient] });

    // Add to recipient's friend list
    const recipientRef = firestore.doc(`users/${req.recipient}`);
    const recipientDoc = await recipientRef.get();
    const recipientFriends = (recipientDoc.data() as UserDocument).friends;
    await senderRef.update({ friends: [...recipientFriends, req.sender] });

    const elasped = Date.now() - start;
    logger.log(`Request : ${doc.id}, Elasped : ${elasped} ms`);
  }
);

export const onFriendRemove = onDocumentDeleted(
  "friend_requests/{id}",
  async (event) => {
    if (!event.data) return;

    const start = Date.now();

    const firestore = admin.firestore();
    const data = event.data.data() as FriendReqDocument;

    // Remove recipient's id from sender's friends
    const senderDocRef = firestore.doc(`users/${data.sender}`);
    const senderDoc = await senderDocRef.get();
    const { friends: senderFriends } = senderDoc.data() as UserDocument;
    await senderDocRef.update({
      friends: removeFriend(senderFriends, data.recipient),
    });

    // Remove sender's id from recipient's friends
    const recipientDocRef = firestore.doc(`users/${data.recipient}`);
    const recipientDoc = await recipientDocRef.get();
    const { friends: recipientFriends } = recipientDoc.data() as UserDocument;
    await recipientDocRef.update({
      friends: removeFriend(recipientFriends, data.sender),
    });

    const elasped = Date.now() - start;
    logger.log(`Removed Friends {${event.data.id}}, Elasped : ${elasped}`);
  }
);
